from django.contrib import admin
from .models import Produto, ProdutoEmEstoque

# admin.site.register(Produto)
# admin.site.register(ProdutoEmEstoque)

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'created_at', 'data_validade')
    ordering = ['-created_at']


@admin.register(ProdutoEmEstoque)
class ProdutoEmEstoqueAdmin(admin.ModelAdmin):
    list_display = ('id', 'id_produto__nome', 'quantidade', 'id_produto__unidade','id_produto__data_validade')
    ordering = ['id_produto__data_validade']