from rest_framework import serializers
from .models import CustomUser
from students.models import Student
from teachers.models import Teacher

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    roll_number = serializers.CharField(required=False, allow_blank=True)
    class_name = serializers.CharField(required=False, allow_blank=True)
    section = serializers.CharField(required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    department = serializers.CharField(required=False, allow_blank=True)
    designation = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'password', 'first_name', 'last_name', 'role',
            'roll_number', 'class_name', 'section', 'date_of_birth', 'department', 'designation',
        )

    def validate(self, attrs):
        role = attrs.get('role')
        if role == 'admin':
            raise serializers.ValidationError({'role': 'Admin accounts cannot be created through registration.'})

        if role == 'student':
            missing = []
            for field in ['roll_number', 'class_name', 'section']:
                if not attrs.get(field):
                    missing.append(field)
            if missing:
                raise serializers.ValidationError({field: 'This field is required for student registration.' for field in missing})
        elif role == 'teacher':
            missing = []
            for field in ['department', 'designation']:
                if not attrs.get(field):
                    missing.append(field)
            if missing:
                raise serializers.ValidationError({field: 'This field is required for teacher registration.' for field in missing})
        return attrs

    def create(self, validated_data):
        role = validated_data.get('role')
        student_data = {
            'roll_number': validated_data.pop('roll_number', None),
            'class_name': validated_data.pop('class_name', None),
            'section': validated_data.pop('section', None),
            'date_of_birth': validated_data.pop('date_of_birth', None),
        }
        teacher_data = {
            'department': validated_data.pop('department', None),
            'designation': validated_data.pop('designation', None),
        }
        user = CustomUser.objects.create_user(**validated_data)

        if role == 'student':
            Student.objects.create(user=user, **student_data)
        elif role == 'teacher':
            Teacher.objects.create(user=user, **teacher_data)

        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')
