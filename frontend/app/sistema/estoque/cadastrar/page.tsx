import React from 'react';
import CadastrarProdutos from '@/app/sistema/estoque/cadastrar/cadastrar-produto';
import CadastrarEstoque from '@/app/sistema/estoque/cadastrar/cadastrar-estoque';

export default function Cadastrar() {
  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-3xl font-bold">Inserir no estoque</h1>
      <CadastrarEstoque />
      <h1 className="mt-10 mb-4 text-3xl font-bold">Novo produto</h1>
      <CadastrarProdutos />
    </div>
  );
}
