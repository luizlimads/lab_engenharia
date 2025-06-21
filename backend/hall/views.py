from django.http.response import HttpResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from produtos.models import Produto, ProdutoEmEstoque
from django.template import Context
# Create your views here.

@login_required
def hall(request):
    produtos_em_estoque = ProdutoEmEstoque.objects.select_related('id_produto').all().order_by('id_produto__data_validade')
    x = {"foo": "bar"}   
    return render(request, 'hall.html', 
                  context={'produtos_em_estoque' : produtos_em_estoque}
                  )


    