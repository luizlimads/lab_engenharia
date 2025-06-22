from django.urls import path
from .views import ProdutoListView, ProdutoCreateView, ProdutoDeleteView, ProdutoUpdateView, ProdutoSummaryView, ProdutoEstoqueBuscaView
from . import views

urlpatterns = [
    path('all/', ProdutoListView.as_view(), name='produto-list'), # metodo get
    path('create/', ProdutoCreateView.as_view(), name='produto-create'), # metodo post
    path('rm/<int:id>/', ProdutoDeleteView.as_view(), name='produto-delete'), # metodo delete
    path('update/<int:id>/', ProdutoUpdateView.as_view(), name='produto-delete'), # metodo put
    path('find/', ProdutoEstoqueBuscaView.as_view(), name='produto-delete'), # metodo put
    path('summary/', ProdutoSummaryView.as_view(), name='produto-delete'), # metodo get
]
