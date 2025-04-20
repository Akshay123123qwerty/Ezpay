from rest_framework import serializers
from .models import Transaction
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class TransactionSerializer(serializers.ModelSerializer):

    sender = serializers.StringRelatedField()
    receiver = serializers.StringRelatedField()

    class Meta:
        model = Transaction
        fields = ['id', 'sender', 'receiver', 'amount', 'transaction_type', 'status', 'timestamp']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        # Ensure username and password are provided
        if not username or not password:
            raise serializers.ValidationError("Username and password are required")

        # Authenticate the user
        user = authenticate(username=username, password=password)

        # If authentication fails, raise an error
        if not user:
            raise serializers.ValidationError("Invalid credentials")

        data["user"] = user  # Add the user to the validated data
        return data

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    

class KYCSerializer(serializers.Serializer):
    aadhaar_number = serializers.CharField(max_length=12)

    def validate_aadhaar_number(self, value):
        if not value.isdigit() or len(value) != 12:
            raise serializers.ValidationError("Invalid Aadhaar number")
        
        return value