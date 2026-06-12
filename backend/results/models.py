from django.db import models
from students.models import Student
from courses.models import Course

class Result(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='results')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='results')
    marks = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=5)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student} - {self.course} - {self.grade}"
