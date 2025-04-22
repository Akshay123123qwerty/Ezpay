from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import wallet, Transaction
from .serializers import UserSerializer, KYCSerializer, LoginSerializer, TransactionSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated

import logging

logger = logging.getLogger(__name__)

# GET all users except current user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    users = User.objects.exclude(username=request.user.username)
    usernames = [user.username for user in users]
    return Response(usernames)

# Register endpoint
@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        wallet.objects.create(user=user, balance=12000)
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login endpoint
@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        tokens = serializer.get_tokens_for_user(user)
        return Response(tokens, status=status.HTTP_200_OK)
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

# Send money
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_money(request):
    sender = request.user
    receiver_username = request.data.get("receiver")
    amount = float(request.data.get("amount", 0))

    if not receiver_username or amount <= 0:
        return Response({"detail": "Invalid data."}, status=status.HTTP_400_BAD_REQUEST)

    if receiver_username == sender.username:
        return Response({"detail": "You cannot send money to yourself."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        receiver = User.objects.get(username=receiver_username)
    except User.DoesNotExist:
        return Response({"receiver": "Receiver does not exist."}, status=status.HTTP_404_NOT_FOUND)

    try:
        sender_wallet = wallet.objects.get(user=sender)
        receiver_wallet = wallet.objects.get(user=receiver)
    except wallet.DoesNotExist:
        return Response({"detail": "wallet not found."}, status=status.HTTP_404_NOT_FOUND)

    if sender_wallet.balance < amount:
        return Response({"detail": "Insufficient balance."}, status=status.HTTP_400_BAD_REQUEST)

    sender_wallet.balance -= amount
    receiver_wallet.balance += amount
    sender_wallet.save()
    receiver_wallet.save()

    Transaction.objects.create(
        sender=sender,
        receiver=receiver,
        amount=amount,
        transaction_type='sent',
        status='completed'
    )

    Transaction.objects.create(
        sender=sender,
        receiver=receiver,
        amount=amount,
        transaction_type='received',
        status='completed'
    )

    return Response({
        "message": "Transaction successful.",
        "new_balance": sender_wallet.balance
    }, status=status.HTTP_201_CREATED)

# Receive money (simulated)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def receive_money(request):
    user = request.user
    
    wallet_obj = wallet.objects.get(user=user)
    if not wallet_obj.kyc_verified:
        return Response({"detail": "KYC verification is required to receive money."}, status=status.HTTP_403_FORBIDDEN)
        
    sender_username = request.data.get('sender')
    amount = request.data.get('amount')

    try:
        sender = User.objects.get(username=sender_username)
    except User.DoesNotExist:
        return Response({"error": "Sender does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError
    except (ValueError, TypeError):
        return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

    Transaction.objects.create(
        sender=sender,
        receiver=user,
        amount=amount,
        transaction_type='received',
        status='completed',
    )
    return Response({"message": "Transaction created"}, status=status.HTTP_201_CREATED)

# Transaction history for a user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transaction_history(request):
    user = request.user

    wallet_obj = wallet.objects.get(user=user)
    if not wallet_obj.kyc_verified:
        return Response({"detail": "KYC verification is required to view transaction history."}, status=status.HTTP_403_FORBIDDEN)
    
    transactions = Transaction.objects.filter(sender=user) | Transaction.objects.filter(receiver=user)
    transactions = transactions.order_by('-timestamp')

    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

# Get wallet balance
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wallet_balance(request):
    try:
        wallet_obj = wallet.objects.get(user=request.user)
        if not wallet_obj.kyc_verified:
            return Response({"detail": "KYC verification required to access wallet balance."}, status=status.HTTP_403_FORBIDDEN)
        return Response({
            "message": "Wallet balance fetched successfully.",
            "balance": wallet_obj.balance,
            "kyc_verified": wallet_obj.kyc_verified
        }, status=status.HTTP_200_OK)
    except wallet.DoesNotExist:
        return Response({"error": "Wallet not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def kyc_verification(request):
    serializer = KYCSerializer(data=request.data)
    if serializer.is_valid():
        aadhaar_number = serializer.validated_data['aadhaar_number']
        user = request.user

        try:
            wallet_obj = wallet.objects.get(user=user)
            wallet_obj.kyc_verified = True
            wallet_obj.aadhaar_number = aadhaar_number
            wallet_obj.save()

            return Response({"message": "KYC verified successfully."}, status=status.HTTP_200_OK)

        except wallet.DoesNotExist:
            return Response({"error": "Wallet not found."}, status=status.HTTP_404_NOT_FOUND)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_kyc_status(request):
    try:
        wallet_obj = wallet.objects.get(user=request.user)
        return Response({
            "kyc_verified": wallet_obj.kyc_verified
        }, status=status.HTTP_200_OK)
    except wallet.DoesNotExist:
        return Response({"error": "Wallet not found."}, status=status.HTTP_404_NOT_FOUND)
