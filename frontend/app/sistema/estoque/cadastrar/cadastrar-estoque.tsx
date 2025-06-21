'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Units } from '@/services/units';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, ScanBarcode } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { BarcodeScanner } from 'react-barcode-scanner';
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

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  produto: z.string().min(2).max(100),
  categoria: z.enum(['perecivel', 'nao_perecivel']),
  unidade: z.enum(Units as [string, ...string[]]),
  quantidade: z.number().min(1),
  validade: z.string().refine((date) => !!Date.parse(date), {
    message: 'Data de validade inválida',
  }),
  codigo: z.string().min(1),
});

export default function CadastrarEstoque() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [products, setProducts] = useState<{ name: string; barcode: string }[]>(
    [],
  );

  useEffect(() => {
    async function fetchProducts() {
      const productsData = await apiClient('/api/products/barcodes')
        .then((response) => response.data)
        .catch((error) => {
          console.error('Erro ao buscar produtos: ', error);
          return [];
        });
      setProducts(productsData);
    }
    fetchProducts();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produto: '',
      categoria: 'perecivel',
      unidade: 'kg',
      quantidade: 1,
      validade: '',
      codigo: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Dados enviados: ', data);
    form.reset();
  };

  return (
    <Form {...form}>
      <div className="grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="produto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produto</FormLabel>
              <FormControl>
                <div className="flex w-full max-w-sm items-center gap-2">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className="w-full"
                      disabled={products.length === 0}>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.barcode} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={products.length === 0}>
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
                          form.setValue('codigo', scannedBarcode);
                          // Find product by barcode and set selector if found
                          const foundProduct = products.find(
                            (product) =>
                              product.barcode &&
                              product.barcode === scannedBarcode,
                          );
                          if (foundProduct) {
                            form.setValue('produto', foundProduct.name);
                          }
                          setScannerOpen(false);
                        }}
                      />
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
          name="quantidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="Quantidade"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="validade"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Validade</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(new Date(field.value), 'dd/MM/yyyy')
                        : 'Selecione uma data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(
                          date ? date.toISOString().split('T')[0] : '',
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}>
          Cadastrar
        </Button>
      </div>
    </Form>
  );
}
