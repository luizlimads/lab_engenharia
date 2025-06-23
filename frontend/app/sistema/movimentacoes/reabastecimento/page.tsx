'use client';

import React from 'react';
import CadastrarEstoque from '@/app/sistema/movimentacoes/reabastecimento/cadastrar-estoque';


export default function Cadastrar() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-3xl font-bold">Cadastrar abastecimento</h1>
      <CadastrarEstoque />
    
    </div>
  );
}
