from rest_framework import serializers
from .models import Result

class ResultSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Result
        fields = ('id', 'student', 'student_name', 'course', 'course_name', 'marks', 'grade')
