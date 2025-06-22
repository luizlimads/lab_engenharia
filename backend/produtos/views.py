from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q


from .models import Produto, ProdutoEmEstoque
from .serializers import ProdutoSerializer

from django.db.models import Sum, Count
from django.utils.timezone import now


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

class ProdutoUpdateView(generics.UpdateAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    lookup_field = 'id'


class ProdutoSummaryView(APIView):
    def get(self, request):
        hoje = now().date()

        # 1. Quantidade total de itens no estoque
        total_itens = ProdutoEmEstoque.objects.aggregate(total=Sum('quantidade'))['total'] or 0

        # 2. Produtos distintos
        nomes_distintos = Produto.objects.values_list('nome', flat=True).distinct()
        total_nomes_distintos = nomes_distintos.count()

        # 3. Soma de produtos distintos por categoria
        produtos_por_categoria = (
            Produto.objects
            .values('categoria')
            .annotate(qtd_distinta=Count('nome', distinct=True))
        )

        # 4. Produtos válidos (validade hoje ou futura)
        produtos_validos = Produto.objects.filter(data_validade__gte=hoje).count()

        # 5. Produtos vencidos (validade passada)
        produtos_invalidos = Produto.objects.filter(data_validade__lt=hoje).count()

        return Response({
            "quantidade_total_itens": total_itens,
            "nomes_distintos": list(nomes_distintos),
            "total_nomes_distintos": total_nomes_distintos,
            "quantidade_por_categoria": list(produtos_por_categoria),
            "quantidade_validos": produtos_validos,
            "quantidade_invalidos": produtos_invalidos,
        })
    
class ProdutoEstoqueBuscaView(APIView):
    def get(self, request):
        filtros = Q()
        campos_validos = ['nome', 'categoria', 'unidade']

        for campo in campos_validos:
            valor = request.query_params.get(campo)
            if valor:
                filtros &= Q(**{f"id_produto__{campo}": valor})

        data_inicio = request.query_params.get('data_validade_inicio')
        data_fim = request.query_params.get('data_validade_fim')

        if data_inicio:
            filtros &= Q(id_produto__data_validade__gte=data_inicio)
        if data_fim:
            filtros &= Q(id_produto__data_validade__lte=data_fim)

        produtos_em_estoque = ProdutoEmEstoque.objects.filter(filtros).select_related('id_produto')

        dados_serializados = [
            {
                "produto": ProdutoSerializer(p.id_produto).data,
                "quantidade": p.quantidade
            }
            for p in produtos_em_estoque
        ]

        return Response(dados_serializados)