from django.db import models
from accounts.models import CustomUser

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student_profile')
    roll_number = models.CharField(max_length=20, unique=True)
    class_name = models.CharField(max_length=50)
    section = models.CharField(max_length=10)
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.roll_number}"
