from rest_framework import serializers
from .models import Course, CourseEnrollment
from accounts.periods import resolve_school_period

class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.user.get_full_name', read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'name', 'code', 'teacher', 'teacher_name', 'academic_year')
        read_only_fields = ('academic_year',)

    def validate_teacher(self, teacher):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if teacher and user and teacher.school_id != user.school_id:
            raise serializers.ValidationError('The assigned teacher must belong to your school.')
        return teacher


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEnrollment
        fields = ('id', 'course', 'student', 'enrolled_at', 'is_active')
        read_only_fields = ('id', 'enrolled_at')

    def validate(self, attrs):
        request = self.context.get('request')
        user = request.user if request else None
        course = attrs.get('course', getattr(self.instance, 'course', None))
        student = attrs.get('student', getattr(self.instance, 'student', None))
        if course and student and course.school_id != student.school_id:
            raise serializers.ValidationError('The student and course must belong to the same school.')
        if user and course and course.school_id != user.school_id:
            raise serializers.ValidationError('You can only enroll students in courses at your school.')
        if user and student and student.school_id != user.school_id:
            raise serializers.ValidationError('You can only enroll students from your school.')
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        year, term = resolve_school_period(user.school, academic_year=validated_data['course'].academic_year)
        return CourseEnrollment.objects.create(
            school=user.school, academic_year=year, term=term, **validated_data
        )
