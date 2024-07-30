from django.urls import path
from .views import UserCreateView, LoginView, UserListView

urlpatterns = [
    path('register/', UserCreateView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', UserListView.as_view(), name='user-list'),

]
