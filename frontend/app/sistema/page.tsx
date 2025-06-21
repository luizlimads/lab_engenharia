'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Box, Package, CheckCircle, XCircle, Layers } from 'lucide-react';
import { apiClient } from '@/services/apiClient';

interface Overview {
  total: number;
  perishable: number;
  nonPerishable: number;
  valid: number;
  expired: number;
}

export default function ProdutosDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiClient('/api/inventory/summary', {
          method: 'GET',
        });
        setOverview(data);
      } catch (error) {
        setError('Erro ao buscar produtos');
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <h1 className="text-3xl font-bold">Visão geral</h1>
        <div className="p-4">
          <p>Carregando dados...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1 className="text-3xl font-bold">Visão geral</h1>
        <div className="p-4">
          <Alert variant="destructive" className="flex items-center space-x-2">
            <XCircle className="text-destructive h-5 w-5" />
            <div>
              <AlertTitle>Erro ao carregar</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        </div>
      </>
    );
  }

  if (!overview) return null;

  const cards = [
    { title: 'Total de produtos', value: overview.total, icon: Package },
    { title: 'Perecíveis', value: overview.perishable, icon: Box },
    { title: 'Não perecíveis', value: overview.nonPerishable, icon: Layers },
    {
      title: 'Produtos para consumo',
      value: overview.valid,
      icon: CheckCircle,
    },
    { title: 'Produtos impróprios', value: overview.expired, icon: XCircle },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold">Visão geral</h1>
      <div className="grid h-100 grid-cols-2 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {cards.map(({ title, value, icon: Icon }) => (
          <Card
            key={title}
            className="flex h-[160px] w-[160px] flex-col justify-center p-5">
            <Icon className="text-primary mb-2 h-5 w-5" />
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                {title}
              </p>
              <p className="text-lg font-semibold">{value}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
