'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Unit } from '@/services/units';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flashlight, ScanBarcode } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { BarcodeScanner, useTorch } from 'react-barcode-scanner';
import 'react-barcode-scanner/polyfill';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/services/apiClient';
import { toast } from 'sonner';

const formSchema = z.object({
  produto: z.string().min(1, 'Produto é obrigatório'),
  inventoryId: z.string().min(1, 'Item de estoque é obrigatório'),
  quantidade: z.number().min(1, 'Quantidade deve ser maior que 0'),
  codigo: z.string().optional(),
  operationType: z.enum(['consumo', 'descarte'], {
    required_error: 'Tipo de operação é obrigatório',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductResponse {
  barcode?: string;
  id: number;
  name: string;
  unit: Unit;
}

interface InventoryItem {
  id: number;
  quantity: number;
  expirationDate: string;
  product: ProductResponse;
}

interface ConsumeInventoryPayload {
  inventoryId: number;
  quantity: number;
  operationType: 'consumo' | 'descarte' | 'furo';
}

export default function ConsumoEstoque() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>(
    undefined,
  );

  const { isTorchSupported, isTorchOn, setIsTorchOn } = useTorch();
  const onTorchSwitch = () => {
    setIsTorchOn(!isTorchOn);
  };

  useEffect(() => {
    async function fetchProducts() {
             setProducts([]);
    
    }
    fetchProducts();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produto: '',
      inventoryId: '',
      quantidade: 1,
      codigo: '',
      operationType: 'consumo',
    },
  });

  // Update selectedUnit when produto changes
  const selectedProductName = form.watch('produto');
  useEffect(() => {
    if (Array.isArray(products)) {
      const selectedProduct = products.find(
        (p) => p && p.name === selectedProductName,
      );
      setSelectedUnit(selectedProduct?.unit);

      // Fetch inventory items for selected product
      if (selectedProduct) {
        fetchInventoryItems(selectedProduct.id);
      } else {
        setInventoryItems([]);
        form.setValue('inventoryId', '');
      }
    }
  }, [products, selectedProductName, form]);

  const fetchInventoryItems = async (productId: number) => {
    try {
      const response: InventoryItem[] = await apiClient(
        `/api/inventory/product/${productId}`,
      );
      setInventoryItems(response);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      setInventoryItems([]);
    }
  };

  // Ensure select value is always a string and matches a product name
  useEffect(() => {
    if (
      Array.isArray(products) &&
      products.length > 0 &&
      !products.some((p) => p && p.name === form.getValues('produto'))
    ) {
      form.setValue('produto', products[0].name);
    }
  }, [products, form]);

  const onSubmit = async (data: FormValues) => {
  
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="produto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Produto</FormLabel>
                <FormControl>
                  <div className="flex w-full max-w-sm items-center gap-2">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}>
                      <SelectTrigger
                        className="w-full"
                        disabled={
                          !Array.isArray(products) || products.length === 0
                        }>
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(products) && products.length > 0 ? (
                          products.map((product) => (
                            <SelectItem key={product.id} value={product.name}>
                              {product.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="text-muted-foreground px-2 py-1 text-sm">
                            Nenhum produto encontrado
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={
                            !Array.isArray(products) || products.length === 0
                          }>
                          <ScanBarcode />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Scanner de código de barras</DialogTitle>
                          <DialogClose />
                        </DialogHeader>
                        <BarcodeScanner
                          options={{
                            formats: ['ean_13', 'upc_a', 'qr_code'],
                            delay: 500,
                          }}
                          onCapture={(result) => {
                            const scannedBarcode = result[0].rawValue;

                            setScannerOpen(false);

                            // Use setTimeout to prevent state update conflicts
                            setTimeout(() => {
                              form.setValue('codigo', scannedBarcode);

                              // Find product by barcode
                              const foundProduct = Array.isArray(products)
                                ? products.find(
                                    (product) =>
                                      product &&
                                      product.barcode &&
                                      product.barcode === scannedBarcode,
                                  )
                                : null;

                              if (foundProduct) {
                                form.setValue('produto', foundProduct.name);
                                toast.success(
                                  `Produto encontrado: ${foundProduct.name}`,
                                );
                              } else {
                                toast.error(
                                  'Código de barras não encontrado no sistema',
                                );
                              }
                            }, 100);
                          }}
                        />
                        {isTorchSupported ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={onTorchSwitch}>
                            <Flashlight className="h-5 w-5" />
                          </Button>
                        ) : null}
                      </DialogContent>
                    </Dialog>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inventoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item de Estoque</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                    disabled={inventoryItems.length === 0}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o item de estoque" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.length > 0 ? (
                        inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            Qtd: {item.quantity} - Validade:{' '}
                            {format(
                              new Date(item.expirationDate),
                              'dd/MM/yyyy',
                            )}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-muted-foreground px-2 py-1 text-sm">
                          Selecione um produto primeiro
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="operationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Operação</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo de operação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consumo">Consumo</SelectItem>
                      <SelectItem value="descarte">Descarte</SelectItem>
                      <SelectItem value="furo">Furo</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Quantidade"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    {selectedUnit && (
                      <span className="text-muted-foreground text-sm">
                        {selectedUnit}
                      </span>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={submitting}>
            {submitting ? 'Registrando...' : 'Registrar baixa'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
