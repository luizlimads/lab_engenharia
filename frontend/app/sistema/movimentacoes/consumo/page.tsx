import React from 'react';
import ConsumoEstoque from '@/app/sistema/movimentacoes/consumo/consumo-estoque';
import { Card, CardContent } from '@/components/ui/card';

export default function Cadastrar() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-3xl font-bold">Baixa de estoque</h1>
      <ConsumoEstoque />
      <Card className="mt-4">
        <CardContent className="p-3">
          <p>
            Em caso de inconsistências com as disponibilidades do estoque
            físico, declare &quot;<b>furo</b> de estoque&quot;.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
