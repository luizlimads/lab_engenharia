
from django.contrib import admin
from django.urls import path, include
import usuarios.views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('usuarios.urls')),
    path('produtos/', include('produtos.urls')),
]


