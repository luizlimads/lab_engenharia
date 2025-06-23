'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export interface LowInventoryProduct {
  id: number;
  name: string;
  barcode: string;
  unit: string;
  category: string;
  minQuantity: number;
  currentQuantity: number;
}

export const minQuantityColumns: ColumnDef<LowInventoryProduct>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Produto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Categoria
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      switch (row.original.category) {
        case 'perecivel':
          return 'Perecível';
        case 'nao_perecivel':
          return 'Não perecível';
        case 'congelado':
          return 'Congelado';
        default:
          return 'N/D';
      }
    },
  },
  {
    accessorKey: 'currentQuantity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Estoque Atual
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const quantity = row.original.currentQuantity;
      const unit = row.original.unit;
      return `${quantity} ${unit}`;
    },
  },
  {
    accessorKey: 'minQuantity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Quantidade Mínima
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const minQuantity = row.original.minQuantity;
      const unit = row.original.unit;
      return `${minQuantity} ${unit}`;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const currentQuantity = row.original.currentQuantity;
      const minQuantity = row.original.minQuantity;

      if (currentQuantity === 0) {
        return <Badge variant="destructive">Sem estoque</Badge>;
      } else if (currentQuantity < minQuantity) {
        return <Badge variant="secondary">Estoque baixo</Badge>;
      }
      return <Badge variant="default">Normal</Badge>;
    },
  },
];
