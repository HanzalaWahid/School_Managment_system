from rest_framework import serializers
from .models import Student
from accounts.serializers import UserSerializer

class StudentSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Student
        fields = ('id', 'user', 'user_detail', 'roll_number', 'class_name', 'section', 'date_of_birth')
