from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from .models import Teacher
from .serializers import TeacherSerializer
from core.permissions import IsAdminOrTeacherReadOnly, receptionist_owns_record, school_admin_owns_record

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.select_related('user', 'school').all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAdminOrTeacherReadOnly]
    http_method_names = ['get', 'put', 'patch', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        if user.role in {'admin', 'school_admin', 'principal', 'receptionist'}:
            return self.queryset.filter(school=user.school)
        if user.role == 'teacher':
            return self.queryset.filter(user=user)
        if user.role == 'student':
            return self.queryset.filter(courses__attendance__student__user=user).distinct()
        return self.queryset.none()

    def get_object(self):
        obj = super().get_object()
        if self.request.user.role in {'admin', 'school_admin', 'principal'}:
            if not school_admin_owns_record(self.request.user, obj):
                raise PermissionDenied('You do not have access to this teacher record.')
        if self.request.user.role == 'receptionist':
            if not receptionist_owns_record(self.request.user, obj):
                raise PermissionDenied('You do not have access to this teacher record.')
        return obj
