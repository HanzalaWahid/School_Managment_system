from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.user.get_full_name', read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'name', 'code', 'teacher', 'teacher_name')
