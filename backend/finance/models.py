from datetime import date

from django.db import models
from django.core.exceptions import ValidationError

from students.models import Student

class Invoice(models.Model):
    STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('unpaid', 'Unpaid'),
        ('pending', 'Pending'),
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='invoices')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='unpaid')
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)

    def clean(self):
        if self.amount <= 0:
            raise ValidationError({'amount': 'Invoice amount must be greater than zero.'})
        if self.due_date and self.due_date < self.created_at.date():
            raise ValidationError({'due_date': 'Due date cannot be before the invoice creation date.'})

    @property
    def is_overdue(self):
        return self.status == 'unpaid' and date.today() > self.due_date

    def mark_paid(self):
        self.status = 'paid'
        self.save(update_fields=['status'])

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Invoice #{self.id} - {self.student} - {self.status}"
