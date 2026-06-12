from rest_framework import viewsets
from .models import Teacher
from .serializers import TeacherSerializer
from core.permissions import IsAdminOrTeacherReadOnly

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.select_related('user').all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAdminOrTeacherReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return self.queryset
        if user.role == 'teacher':
            return self.queryset.filter(user=user)
        return self.queryset.none()
