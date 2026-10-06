from decimal import Decimal

from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from django.db.models.functions import Coalesce
from .models import Invoice
from .models import FeeStructure, Payment
from .serializers import FeeStructureSerializer, InvoiceSerializer, PaymentSerializer
from accounts.audit import record_audit
from accounts.models import AuditLog
from accounts.periods import resolve_school_period
from core.permissions import IsAdminOrStudentInvoicePermission, accountant_owns_record, assert_student_owns_record, school_admin_owns_record

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.select_related('student__user', 'student__school', 'school').all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAdminOrStudentInvoicePermission]
    http_method_names = ['get', 'post', 'put', 'patch', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        if user.role in {'admin', 'school_admin', 'accountant'}:
            return self.queryset.filter(student__school=user.school)
        if user.role == 'principal':
            return self.queryset.filter(student__school=user.school)
        if user.role == 'student':
            return self.queryset.filter(student__user=user)
        if user.role == 'parent':
            queryset = self.queryset.filter(student__guardians__user=user)
            selected_student = self.request.query_params.get('student')
            if selected_student:
                queryset = queryset.filter(student_id=selected_student)
            return queryset.distinct()
        return self.queryset.none()

    @action(detail=False, methods=['get'])
    def summary(self, request):
        invoices = Invoice.objects.filter(school_id=request.user.school_id).exclude(status='void').prefetch_related('payments')
        total_amount = Decimal('0.00')
        total_collected = Decimal('0.00')
        outstanding_amount = Decimal('0.00')
        paid_invoices = 0
        outstanding_invoices = 0
        total_invoices = 0
        for invoice in invoices:
            total_invoices += 1
            paid_amount = sum((payment.amount for payment in invoice.payments.all()), Decimal('0.00'))
            total_amount += invoice.amount
            total_collected += paid_amount
            balance = max(invoice.amount - paid_amount, Decimal('0.00'))
            if balance:
                outstanding_amount += balance
                outstanding_invoices += 1
            else:
                paid_invoices += 1
        return Response({
            'total_invoices': total_invoices,
            'total_amount': total_amount,
            'total_collected': total_collected,
            'unpaid_amount': outstanding_amount,
            'paid_invoices': paid_invoices,
            'outstanding_invoices': outstanding_invoices,
        })

    def get_object(self):
        obj = super().get_object()
        if self.request.user.role in {'admin', 'school_admin'}:
            if not school_admin_owns_record(self.request.user, obj):
                raise PermissionDenied('You do not have access to this invoice.')
        if self.request.user.role == 'accountant':
            if not accountant_owns_record(self.request.user, obj):
                raise PermissionDenied('You do not have access to this invoice.')
        if self.request.user.role == 'student':
            assert_student_owns_record(self.request.user, obj)
        return obj

    def perform_create(self, serializer):
        user = self.request.user
        student = serializer.validated_data.get('student')
        if student is None or student.school_id != user.school_id:
            raise PermissionDenied('You can only create invoices for students in your school.')
        year, term = resolve_school_period(student.school, academic_year=serializer.validated_data.get('academic_year'))
        if user.role == 'accountant':
            invoice = serializer.save(school=user.school, academic_year=year, term=term)
            record_audit(user, 'invoice.created', invoice)
            return
        invoice = serializer.save(school=user.school, academic_year=year, term=term)
        record_audit(user, 'invoice.created', invoice)

    def perform_update(self, serializer):
        user = self.request.user
        student = serializer.validated_data.get('student', serializer.instance.student)
        if student.school_id != user.school_id:
            raise PermissionDenied('You can only update invoices for students in your school.')
        year, term = resolve_school_period(student.school, academic_year=serializer.validated_data.get('academic_year', serializer.instance.academic_year))
        invoice = serializer.save(school=user.school, academic_year=year, term=term)
        record_audit(user, 'invoice.updated', invoice)

    @action(detail=True, methods=['post'])
    def void(self, request, pk=None):
        if request.user.role not in {'admin', 'school_admin', 'accountant'}:
            raise PermissionDenied('Only finance staff can void invoices.')
        invoice = self.get_object()
        reason = request.data.get('reason', '').strip()
        if not reason:
            return Response({'reason': 'A reason is required to void an invoice.'}, status=400)
        if invoice.status == 'void':
            return Response({'detail': 'Invoice is already void.'}, status=400)
        if invoice.payments.exists():
            return Response({'detail': 'Invoices with recorded payments cannot be voided; use an adjustment workflow.'}, status=400)
        invoice.status = 'void'
        invoice.void_reason = reason
        invoice.voided_by = request.user
        from django.utils import timezone
        invoice.voided_at = timezone.now()
        invoice.save(update_fields=['status', 'void_reason', 'voided_by', 'voided_at'])
        record_audit(request.user, 'invoice.voided', invoice, {'reason': reason})
        return Response(self.get_serializer(invoice).data)


class FinanceResourcePermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        role = request.user.role
        if role == 'accountant':
            return True
        if role in {'admin', 'school_admin'}:
            return request.method in SAFE_METHODS
        return role in {'student', 'parent'} and request.method in SAFE_METHODS


class FeeStructurePermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == 'accountant':
            return True
        return request.user.role in {'admin', 'school_admin'} and request.method in SAFE_METHODS


class FeeStructureViewSet(viewsets.ModelViewSet):
    queryset = FeeStructure.objects.select_related('school', 'academic_year')
    serializer_class = FeeStructureSerializer
    permission_classes = [FeeStructurePermission]
    http_method_names = ['get', 'post', 'put', 'patch', 'head', 'options']

    def get_queryset(self):
        return self.queryset.filter(school_id=self.request.user.school_id)

    def perform_create(self, serializer):
        fee = serializer.save(school=self.request.user.school)
        record_audit(self.request.user, 'fee_structure.created', fee)

    def perform_update(self, serializer):
        fee = serializer.save(school=self.request.user.school)
        record_audit(self.request.user, 'fee_structure.updated', fee)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=['is_active'])
        record_audit(self.request.user, 'fee_structure.deactivated', instance)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related('invoice__student__user', 'school', 'received_by')
    serializer_class = PaymentSerializer
    permission_classes = [FinanceResourcePermission]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        if user.role in {'admin', 'school_admin', 'accountant'}:
            return self.queryset.filter(school_id=user.school_id)
        if user.role == 'student':
            return self.queryset.filter(invoice__student__user=user)
        if user.role == 'parent':
            queryset = self.queryset.filter(invoice__student__guardians__user=user)
            selected_student = self.request.query_params.get('student')
            if selected_student:
                queryset = queryset.filter(invoice__student_id=selected_student)
            return queryset.distinct()
        return self.queryset.none()

    def perform_create(self, serializer):
        payment = serializer.save()
        record_audit(self.request.user, 'payment.recorded', payment, {'amount': str(payment.amount), 'method': payment.method})


class FinanceAuditPermission(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated
            and request.user.role in {'admin', 'school_admin', 'accountant'}
            and request.method in SAFE_METHODS
        )


class FinanceAuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = ('id', 'actor_id', 'action', 'object_type', 'object_id', 'details', 'created_at')


class FinanceAuditViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FinanceAuditSerializer
    permission_classes = [FinanceAuditPermission]
    queryset = AuditLog.objects.all()

    def get_queryset(self):
        return self.queryset.filter(
            school_id=self.request.user.school_id,
        ).filter(
            Q(action__startswith='invoice.')
            | Q(action__startswith='payment.')
            | Q(action__startswith='fee_structure.')
        )