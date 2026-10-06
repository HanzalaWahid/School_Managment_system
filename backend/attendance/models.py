from django.db import models
from students.models import Student
from courses.models import Course
from accounts.models import AcademicYear, Term

class Attendance(models.Model):
    STATUS_CHOICES = (
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='attendance')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT, related_name='attendance_records')
    term = models.ForeignKey(Term, on_delete=models.PROTECT, related_name='attendance_records')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='present')

    class Meta:
        unique_together = ('student', 'course', 'date')

    def __str__(self):
        return f"{self.student} - {self.course} - {self.date} - {self.status}"
