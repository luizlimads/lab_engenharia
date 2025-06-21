from django.http.response import HttpResponse
from django.urls import reverse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as django_login, logout


# Create your views here.
def redirect_to_login(request):
    url = reverse('login')
    return redirect(url)


def login(request):
    if request.method == "GET":
        user_authenticated = request.user.is_authenticated
        if user_authenticated:
            logout(request)
        return render(request, 'login.html')
    else:
        user = request.POST.get("user")
        password = request.POST.get("password")
        auth_user = authenticate(username=user, password=password)
        if auth_user is not None:
            django_login(request, auth_user)
            url = reverse('hall')
            return redirect(url)
        else:
            return HttpResponse("Não autenticado")


def register(request):
    if request.method == "GET":
        return render(request, 'register.html')
    else:
        user = request.POST.get("user")
        password = request.POST.get("password")
        invalid_user = User.objects.filter(username = user).exists()
        if invalid_user:
            return HttpResponse('Usuario já existente')
        return HttpResponse(user)
    

def handler404(request, exception=None):
    url = reverse('login')
    return redirect(url)




# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from usuarios.models import Usuario  # substitua pelo seu model
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'detail': 'E-mail e senha são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response({'detail': 'Credenciais inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'email': user.email,
            'userId': str(user.id),
        })