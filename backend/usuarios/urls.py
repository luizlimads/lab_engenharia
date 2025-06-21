from django.urls import path
from . import views

from .views import LoginView



urlpatterns = [
    path('', views.redirect_to_login),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('api/auth/login', LoginView.as_view(), name='login'),
]
