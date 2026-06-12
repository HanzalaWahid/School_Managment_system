from django.db import models
from accounts.models import CustomUser

class Teacher(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='teacher_profile')
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.department}"
