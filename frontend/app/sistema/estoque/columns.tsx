'use client';

import { Button } from '@/components/ui/button';
import { Produto } from '@/services/productsService';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<Produto>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'nome',
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
    accessorKey: 'categoria',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Perecível
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const categoria = row.original.categoria;
      return categoria === 'perecivel' ? 'Sim' : 'Não';
    },
  },
  {
    accessorKey: 'quantidade',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Quantidade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { quantidade, unidade } = row.original;
      // Add "s" only if quantidade is not 1 and unidade doesn't already end with "s"
      const suffix =
        quantidade !== 1 && !unidade.endsWith('s') && unidade !== 'kg'
          ? 's'
          : '';
      return `${quantidade} ${unidade}${suffix}`;
    },
  },
  {
    accessorKey: 'data_validade',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Validade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.data_validade);
      return format(date, 'dd/MM/yy');
    },
  },
];
