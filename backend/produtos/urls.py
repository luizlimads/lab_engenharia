from django.urls import path
from .views import ProdutoListView
from . import views

urlpatterns = [
    path('all/', ProdutoListView.as_view(), name='produto-list'),
]
