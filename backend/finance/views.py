from rest_framework import viewsets
from .models import Invoice
from .serializers import InvoiceSerializer
from core.permissions import IsAdminOrStudentInvoicePermission

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.select_related('student__user').all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAdminOrStudentInvoicePermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return self.queryset
        if user.role == 'student':
            return self.queryset.filter(student__user=user)
        return self.queryset.none()
