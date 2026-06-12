from django.urls import path
from .views import RegisterView, LoginView, MeView, UserListView, ValidateTokenView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('validate/', ValidateTokenView.as_view(), name='validate-token'),
    path('users/', UserListView.as_view(), name='user-list'),
]
