from django.urls import path
from .views import ProdutoListView, ProdutoCreateView
from . import views

urlpatterns = [
    path('all/', ProdutoListView.as_view(), name='produto-list'),
    path('create/', ProdutoCreateView.as_view(), name='produto-create'),
]
