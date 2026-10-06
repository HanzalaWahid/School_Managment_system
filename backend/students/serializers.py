from rest_framework import serializers
from .models import Student
from accounts.serializers import UserSerializer

class StudentSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source='user.phone', required=False, allow_blank=True)
    user_detail = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Student
        fields = ('id', 'user', 'user_detail', 'phone', 'roll_number', 'class_name', 'section', 'date_of_birth')
        read_only_fields = ('id', 'user')

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        for field, value in user_data.items():
            setattr(instance.user, field, value)
        if user_data:
            instance.user.save(update_fields=list(user_data))
        return super().update(instance, validated_data)


class StudentBasicSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_detail = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ('id', 'full_name', 'user_detail', 'roll_number', 'class_name', 'section')

    def get_user_detail(self, student):
        return {
            'first_name': student.user.first_name,
            'last_name': student.user.last_name,
        }


class StudentContactSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source='user.phone', required=False, allow_blank=True)
    user_detail = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Student
        fields = ('id', 'user_detail', 'phone')
        read_only_fields = ('id', 'user_detail')

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        for field, value in user_data.items():
            setattr(instance.user, field, value)
        if user_data:
            instance.user.save(update_fields=list(user_data))
        return instance
