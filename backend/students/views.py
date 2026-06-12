from rest_framework import viewsets
from .models import Student
from .serializers import StudentSerializer
from core.permissions import IsAdminOrTeacherReadOnly

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related('user').all()
    serializer_class = StudentSerializer
    permission_classes = [IsAdminOrTeacherReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'teacher']:
            return self.queryset
        if user.role == 'student':
            return self.queryset.filter(user=user)
        return self.queryset.none()
