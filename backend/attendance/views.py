from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Attendance
from .serializers import AttendanceSerializer
from core.permissions import IsAdminOrTeacherAttendancePermission

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('student__user', 'course').all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAdminOrTeacherAttendancePermission]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['student', 'course', 'date', 'status']

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'teacher']:
            return self.queryset
        if user.role == 'student':
            return self.queryset.filter(student__user=user)
        return self.queryset.none()
