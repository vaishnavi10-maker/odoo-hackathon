from django.contrib.auth.models import User
from rest_framework import serializers
from .models import ExpenseRequest
class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class ExpenseRequestSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ExpenseRequest
        fields = ['id', 'subject', 'owner', 'category', 'status', 'amount', 'is_finalized', 'created_at']