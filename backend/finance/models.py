from datetime import date

from django.db import models
from django.db.models import Sum
from django.core.exceptions import ValidationError

from accounts.models import School
from students.models import Student
from accounts.models import AcademicYear, CustomUser

class Invoice(models.Model):
    STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('unpaid', 'Unpaid'),
        ('pending', 'Pending'),
        ('partially_paid', 'Partially Paid'),
        ('void', 'Void'),
    )
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='invoices')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT, related_name='invoices')
    term = models.ForeignKey('accounts.Term', on_delete=models.PROTECT, related_name='invoices')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='invoices')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unpaid')
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    void_reason = models.TextField(blank=True)
    voided_at = models.DateTimeField(null=True, blank=True)
    voided_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='voided_invoices')

    class Meta:
        ordering = ('-created_at',)

    def clean(self):
        if self.amount <= 0:
            raise ValidationError({'amount': 'Invoice amount must be greater than zero.'})
        if self.due_date and self.due_date < date.today():
            raise ValidationError({'due_date': 'Due date cannot be in the past.'})

    @property
    def is_overdue(self):
        return self.status == 'unpaid' and date.today() > self.due_date

    @property
    def paid_amount(self):
        return self.payments.aggregate(total=Sum('amount'))['total'] or 0

    @property
    def balance_due(self):
        return max(self.amount - self.paid_amount, 0)

    def mark_paid(self):
        self.status = 'paid'
        self.save(update_fields=['status'])

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Invoice #{self.id} - {self.student} - {self.status}"


class FeeStructure(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='fee_structures')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT, related_name='fee_structures')
    term = models.ForeignKey('accounts.Term', on_delete=models.PROTECT, related_name='fee_structures')
    title = models.CharField(max_length=120)
    class_name = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=('academic_year', 'class_name', 'title'), name='unique_fee_title_per_class_year'),
        ]

    def clean(self):
        if self.amount <= 0:
            raise ValidationError({'amount': 'Fee amount must be greater than zero.'})
        if self.academic_year_id and self.school_id != self.academic_year.school_id:
            raise ValidationError({'academic_year': 'Academic year must belong to this school.'})

    def __str__(self):
        return f'{self.title} - {self.class_name}'


class Payment(models.Model):
    PAYMENT_METHODS = (
        ('cash', 'Cash'),
        ('bank', 'Bank'),
        ('online', 'Online'),
    )
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='payments')
    invoice = models.ForeignKey(Invoice, on_delete=models.PROTECT, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=10, choices=PAYMENT_METHODS)
    reference = models.CharField(max_length=120, blank=True)
    received_by = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='received_payments')
    received_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.amount <= 0:
            raise ValidationError({'amount': 'Payment amount must be greater than zero.'})
        if self.invoice_id and self.school_id != self.invoice.school_id:
            raise ValidationError({'invoice': 'Invoice must belong to this school.'})
        if self.invoice_id and self.invoice.status == 'void':
            raise ValidationError({'invoice': 'Payments cannot be recorded against a void invoice.'})
        if self.invoice_id and self.amount > self.invoice.balance_due:
            raise ValidationError({'amount': 'Payment cannot exceed the invoice balance.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
        if self.invoice.balance_due <= 0:
            self.invoice.status = 'paid'
        elif self.invoice.paid_amount > 0:
            self.invoice.status = 'partially_paid'
        self.invoice.save(update_fields=['status'])
