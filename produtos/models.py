from django.db import models

# Create your models here.

class Produto(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=200)
    categoria = models.CharField(max_length=20)
    unidade = models.CharField(max_length=20)
    data_validade = models.DateField()
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} - {self.created_at}"


class ProdutoEmEstoque(models.Model):
    id = models.AutoField(primary_key=True)
    id_produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.FloatField()

    def __str__(self):
        return f"{self.id_produto.nome} {self.quantidade} {self.id_produto.unidade} {self.id_produto.data_validade}"