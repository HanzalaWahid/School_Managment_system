from rest_framework import serializers
from .models import Result
from attendance.models import Attendance
from courses.models import CourseEnrollment
from accounts.periods import resolve_school_period

class ResultSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Result
        fields = ('id', 'student', 'student_name', 'course', 'course_name', 'marks', 'grade', 'is_published', 'published_at', 'academic_year', 'term')
        read_only_fields = ('id', 'is_published', 'published_at', 'academic_year', 'term')

    def validate(self, attrs):
        request = self.context.get('request')
        user = request.user if request else None
        course = attrs.get('course', getattr(self.instance, 'course', None))
        student = attrs.get('student', getattr(self.instance, 'student', None))
        if course and student and course.school_id != student.school_id:
            raise serializers.ValidationError('The student and course must belong to the same school.')
        if course:
            try:
                resolve_school_period(course.school, academic_year=course.academic_year)
            except Exception as error:
                raise serializers.ValidationError({'course': str(error)}) from error
        if course and student and not CourseEnrollment.objects.filter(
            course=course, student=student, school_id=student.school_id, is_active=True
        ).exists():
            raise serializers.ValidationError({'student': 'This student is not enrolled in the selected course.'})
        if user and user.role in {'admin', 'school_admin'} and student and student.school_id != user.school_id:
            raise serializers.ValidationError('You can only manage results in your school.')
        if user and user.role == 'teacher':
            teacher_profile = getattr(user, 'teacher_profile', None)
            if course and (not teacher_profile or course.teacher_id != teacher_profile.pk):
                raise serializers.ValidationError({'course': 'You are not assigned to this course.'})
            if self.instance and self.instance.is_published:
                raise serializers.ValidationError('Published results are locked. Request an administrator to reopen them.')
        return attrs
