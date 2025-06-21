import { Inventory } from '@/services/inventoryService';

export type Categoria = 'perecivel' | 'nao_perecivel';

export interface Product {
  id: number;
  name: string;
  barcode: string;
  unit: string;
  category: Categoria;
  inventory: Inventory;
}
