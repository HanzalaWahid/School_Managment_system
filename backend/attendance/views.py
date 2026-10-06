from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from .models import Attendance
from .serializers import AttendanceSerializer
from core.permissions import IsAdminOrTeacherAttendancePermission, assert_student_owns_record, school_admin_owns_record
from accounts.periods import resolve_school_period
from accounts.audit import record_audit

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('student__user', 'student__school', 'course__school').all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAdminOrTeacherAttendancePermission]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['student', 'course', 'date', 'status']
    http_method_names = ['get', 'post', 'put', 'patch', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        if user.role in {'admin', 'school_admin', 'principal'}:
            return self.queryset.filter(student__school=user.school)
        if user.role == 'teacher':
            return self.queryset.filter(course__teacher__user=user)
        if user.role == 'student':
            return self.queryset.filter(student__user=user)
        if user.role == 'parent':
            queryset = self.queryset.filter(student__guardians__user=user)
            selected_student = self.request.query_params.get('student')
            if selected_student:
                queryset = queryset.filter(student_id=selected_student)
            return queryset.distinct()
        return self.queryset.none()

    def perform_update(self, serializer):
        instance = serializer.instance
        before = {'student_id': instance.student_id, 'course_id': instance.course_id, 'date': str(instance.date), 'status': instance.status}
        course = serializer.validated_data.get('course', serializer.instance.course)
        attendance_date = serializer.validated_data.get('date', serializer.instance.date)
        year, term = resolve_school_period(course.school, academic_year=course.academic_year, on_date=attendance_date)
        attendance = serializer.save(academic_year=year, term=term)
        record_audit(self.request.user, 'attendance.updated', attendance, {
            'before': before,
            'after': {'student_id': attendance.student_id, 'course_id': attendance.course_id, 'date': str(attendance.date), 'status': attendance.status},
        })

    def perform_create(self, serializer):
        course = serializer.validated_data['course']
        attendance_date = serializer.validated_data['date']
        year, term = resolve_school_period(course.school, academic_year=course.academic_year, on_date=attendance_date)
        attendance = serializer.save(academic_year=year, term=term)
        record_audit(self.request.user, 'attendance.created', attendance, {
            'after': {'student_id': attendance.student_id, 'course_id': attendance.course_id, 'date': str(attendance.date), 'status': attendance.status},
        })

    def get_object(self):
        obj = super().get_object()
        if self.request.user.role in {'admin', 'school_admin', 'principal'}:
            if not school_admin_owns_record(self.request.user, obj):
                raise PermissionDenied('You do not have access to this attendance record.')
        if self.request.user.role == 'student':
            assert_student_owns_record(self.request.user, obj)
        return obj
