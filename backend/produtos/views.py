from rest_framework import generics
from .models import Produto
from .serializers import ProdutoSerializer

class ProdutoListView(generics.ListAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

class ProdutoCreateView(generics.CreateAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
class ProdutoDeleteView(generics.DestroyAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    lookup_field = 'id'
