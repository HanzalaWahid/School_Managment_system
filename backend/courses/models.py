from django.db import models
from accounts.models import School
from accounts.models import AcademicYear, Term
from teachers.models import Teacher
from students.models import Student

class Course(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='courses')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT, related_name='courses')
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses')

    def __str__(self):
        return f"{self.code} - {self.name}"


class CourseEnrollment(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='course_enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='course_enrollments')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT, related_name='course_enrollments')
    term = models.ForeignKey(Term, on_delete=models.PROTECT, related_name='course_enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=('course', 'student'), name='unique_student_course_enrollment'),
        ]

    def __str__(self):
        return f"{self.student} - {self.course}"
