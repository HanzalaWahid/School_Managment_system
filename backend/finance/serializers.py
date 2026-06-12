from rest_framework import serializers
from .models import Invoice

class InvoiceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    student_id = serializers.IntegerField(source='student.id', read_only=True)
    is_overdue = serializers.BooleanField(source='is_overdue', read_only=True)

    class Meta:
        model = Invoice
        fields = ('id', 'student', 'student_id', 'student_name', 'amount', 'status', 'due_date', 'created_at', 'is_overdue')
