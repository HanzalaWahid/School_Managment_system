from django.db import models
from django.utils import timezone
from students.models import Student
from courses.models import Course
from accounts.models import AcademicYear, Term


class ResultQuerySet(models.QuerySet):
    def published(self):
        return self.filter(is_published=True)


class Result(models.Model):
    objects = ResultQuerySet.as_manager()

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='results')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='results')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT, related_name='results')
    term = models.ForeignKey(Term, on_delete=models.PROTECT, related_name='results')
    marks = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=5)
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student} - {self.course} - {self.grade}"
