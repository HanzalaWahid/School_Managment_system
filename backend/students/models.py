from django.db import models
from accounts.models import CustomUser, School
from accounts.models import AcademicYear, Term

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student_profile')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='students')
    roll_number = models.CharField(max_length=20, unique=True)
    class_name = models.CharField(max_length=50)
    section = models.CharField(max_length=10)
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.roll_number}"


class StudentAcademicHistory(models.Model):
    ACTION_CHOICES = (
        ('admitted', 'Admitted'),
        ('promoted', 'Promoted'),
        ('transferred', 'Transferred'),
        ('graduated', 'Graduated'),
        ('deactivated', 'Deactivated'),
    )
    student = models.ForeignKey(Student, on_delete=models.PROTECT, related_name='academic_history')
    school = models.ForeignKey(School, on_delete=models.PROTECT, related_name='student_history')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT, related_name='student_history')
    term = models.ForeignKey(Term, on_delete=models.PROTECT, related_name='student_history')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    from_class = models.CharField(max_length=50, blank=True)
    from_section = models.CharField(max_length=10, blank=True)
    to_class = models.CharField(max_length=50, blank=True)
    to_section = models.CharField(max_length=10, blank=True)
    details = models.JSONField(default=dict, blank=True)
    occurred_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-occurred_at',)

    def __str__(self):
        return f'{self.student}: {self.action}'
