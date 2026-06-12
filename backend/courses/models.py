from django.db import models
from teachers.models import Teacher

class Course(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses')

    def __str__(self):
        return f"{self.code} - {self.name}"
