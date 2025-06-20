from django.urls import path
from . import views

urlpatterns = [
    path('view/', views.view, name='view_produto'),
    path('view-all/', views.view_all, name='view-all_produto'),
    path('add/', views.add, name='add_produto'),
    path('rm/', views.rm, name='rm_produto'),
    path('put/', views.put, name='put_produto'),
]
