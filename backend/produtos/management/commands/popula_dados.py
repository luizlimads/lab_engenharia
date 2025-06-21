import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from produtos.models import Produto, ProdutoEmEstoque

class Command(BaseCommand):
    help = 'Popula o banco de dados com dados fictícios para Produto e ProdutoEmEstoque'

    def handle(self, *args, **kwargs):
        # Lista de produtos fictícios
        produtos = [
            {'nome': 'Arroz', 'categoria': 'Cereal', 'unidade': 'kg'},
            {'nome': 'Feijão', 'categoria': 'Leguminosa', 'unidade': 'kg'},
            {'nome': 'Macarrão', 'categoria': 'Massa', 'unidade': 'pacote'},
            {'nome': 'Farinha de Trigo', 'categoria': 'Farinha', 'unidade': 'kg'},
            {'nome': 'Açúcar', 'categoria': 'Açúcar', 'unidade': 'kg'},
            {'nome': 'Sal', 'categoria': 'Condimento', 'unidade': 'kg'},
            {'nome': 'Óleo de Soja', 'categoria': 'Óleo', 'unidade': 'litro'},
            {'nome': 'Leite Integral', 'categoria': 'Laticínio', 'unidade': 'litro'},
            {'nome': 'Café', 'categoria': 'Bebida', 'unidade': 'pacote'},
            {'nome': 'Manteiga', 'categoria': 'Laticínio', 'unidade': 'kg'},
            # Adicione mais produtos conforme necessário
        ]

        # Data atual
        hoje = datetime.today().date()

        # Criar produtos e seus estoques
        for produto_data in produtos:
            # Criar produto
            produto = Produto.objects.create(
                nome=produto_data['nome'],
                categoria=produto_data['categoria'],
                unidade=produto_data['unidade'],
                data_validade=hoje + timedelta(days=random.randint(30, 365)),
                created_at=hoje
            )

            # Criar estoque para o produto
            ProdutoEmEstoque.objects.create(
                id_produto=produto,
                quantidade=round(random.uniform(1, 100), 2)
            )

        self.stdout.write(self.style.SUCCESS('Dados fictícios inseridos com sucesso.'))
