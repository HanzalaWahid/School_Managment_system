from rest_framework import serializers
from .models import Teacher
from accounts.serializers import UserSerializer

class TeacherSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Teacher
        fields = ('id', 'user', 'user_detail', 'department', 'designation')
