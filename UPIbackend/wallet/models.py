from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

# Wallet Model - one per user
class wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    balance = models.FloatField(default=0)
    kyc_verified =  models.BooleanField(default=False)
    aadhaar_number = models.CharField(max_length=12, blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username}'s Wallet - Balance: ₹{self.balance}"

# Transaction Model - many per user
class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('sent', 'Sent'),
        ('received', 'Received'),
    )

    TRANSACTION_STATUSES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )

    sender = models.ForeignKey(User, related_name='sent_transactions', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_transactions', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(choices=TRANSACTION_TYPES, max_length=10)
    status = models.CharField(max_length=20, choices=TRANSACTION_STATUSES, default="pending")
    timestamp = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.sender == self.receiver:
            raise ValidationError("Sender and receiver cannot be the same.")

    def __str__(self):
        return f"{self.sender.username} → {self.receiver.username}: ₹{self.amount} ({self.status})"
