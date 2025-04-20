from django.urls import path
from .views import (
    register,
    list_users,
    kyc_verification,
    get_wallet_balance,
    login,
    send_money,
    receive_money,
    transaction_history,
    check_kyc_status
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('users/', list_users, name='list_users'),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('send_money/', send_money, name='send_money'),
    path('receive_money/', receive_money, name='receive_money'),
    path('transaction_history/', transaction_history, name='transaction_history'),
    path('balance/', get_wallet_balance, name='get_wallet_balance'),
    path('kyc/', kyc_verification, name='kyc_verification'),
    path('kyc_status/', check_kyc_status, name='check_kyc_status'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
