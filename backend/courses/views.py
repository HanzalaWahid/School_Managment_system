from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Course
from .serializers import CourseSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('teacher__user').all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
