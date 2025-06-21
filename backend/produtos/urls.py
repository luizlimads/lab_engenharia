from django.urls import path
from .views import ProdutoListView, ProdutoCreateView, ProdutoDeleteView
from . import views

urlpatterns = [
    path('all/', ProdutoListView.as_view(), name='produto-list'),
    path('create/', ProdutoCreateView.as_view(), name='produto-create'),
    path('rm/<int:id>/', ProdutoDeleteView.as_view(), name='produto-delete'),
]
