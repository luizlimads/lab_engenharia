import { Product } from '@/services/productsService';

export interface Inventory {
  id: number;
  product: Produto;
  barcode: string;
  unit: string;
  category: Categoria;
  inventory: Inventory;
}
