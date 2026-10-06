from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from accounts.audit import record_audit
from accounts.periods import resolve_school_period
from .models import Student, StudentAcademicHistory
from core.permissions import IsSchoolAdminOnly
from .serializers import StudentBasicSerializer, StudentContactSerializer, StudentSerializer
from core.permissions import IsStudentDirectoryAccess

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related('user', 'school').all()
    serializer_class = StudentSerializer
    permission_classes = [IsStudentDirectoryAccess]
    http_method_names = ['get', 'post', 'put', 'patch', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        if user.role in {'admin', 'school_admin', 'principal', 'accountant', 'receptionist'}:
            return self.queryset.filter(school=user.school)
        if user.role == 'parent':
            queryset = self.queryset.filter(guardians__user=user).distinct()
            selected_student = self.request.query_params.get('student')
            return queryset.filter(pk=selected_student) if selected_student else queryset
        if user.role == 'teacher':
            return self.queryset.filter(
                course_enrollments__course__teacher__user=user,
                course_enrollments__school_id=user.school_id,
                course_enrollments__is_active=True,
            ).distinct()
        if user.role == 'student':
            return self.queryset.filter(user=user)
        return self.queryset.none()

    def create(self, request, *args, **kwargs):
        return Response({'detail': 'Create students through the school account provisioning endpoint.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def get_serializer_class(self):
        if self.request.user.role == 'accountant':
            return StudentBasicSerializer
        if self.request.user.role == 'receptionist':
            return StudentContactSerializer
        return StudentSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsSchoolAdminOnly])
    def promote(self, request, pk=None):
        student = self.get_object()
        new_class = request.data.get('class_name', '').strip()
        new_section = request.data.get('section', '').strip()
        if not new_class or not new_section:
            return Response({'detail': 'class_name and section are required.'}, status=400)
        year, term = resolve_school_period(student.school)
        before = {'class_name': student.class_name, 'section': student.section}
        StudentAcademicHistory.objects.create(
            student=student, school=student.school, academic_year=year, term=term,
            action='promoted', from_class=student.class_name, from_section=student.section,
            to_class=new_class, to_section=new_section,
        )
        student.class_name = new_class
        student.section = new_section
        student.save(update_fields=['class_name', 'section'])
        record_audit(request.user, 'student.promoted', student, {
            'before': before, 'after': {'class_name': new_class, 'section': new_section},
        })
        return Response(StudentSerializer(student, context={'request': request}).data)

    @action(detail=True, methods=['post'], permission_classes=[IsSchoolAdminOnly])
    def deactivate(self, request, pk=None):
        student = self.get_object()
        if not student.user.is_active:
            return Response({'detail': 'Student is already inactive.'}, status=400)
        year, term = resolve_school_period(student.school)
        StudentAcademicHistory.objects.create(
            student=student, school=student.school, academic_year=year, term=term,
            action='deactivated', from_class=student.class_name, from_section=student.section,
        )
        student.user.is_active = False
        student.user.save(update_fields=['is_active'])
        record_audit(request.user, 'student.deactivated', student, {'is_active': False})
        return Response({'detail': 'Student deactivated.'})

