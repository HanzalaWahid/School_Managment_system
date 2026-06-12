from django.contrib import admin
from .models import Invoice

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'amount', 'status', 'due_date', 'created_at', 'is_overdue')
    list_filter = ('status', 'due_date')
    search_fields = ('student__user__first_name', 'student__user__last_name', 'student__roll_number')
    readonly_fields = ('created_at', 'is_overdue')
