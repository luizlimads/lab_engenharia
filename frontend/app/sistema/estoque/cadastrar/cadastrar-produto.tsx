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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Units } from '@/services/units';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScanBarcode } from 'lucide-react';
import { useState } from 'react';
import { BarcodeScanner } from 'react-barcode-scanner';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { z } from 'zod';

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

export default function CadastrarProdutos() {
  const [scannerOpen, setScannerOpen] = useState(false);
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
                <Input placeholder="Nome do produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perecivel">Perecível</SelectItem>
                    <SelectItem value="nao_perecivel">Não perecível</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {Units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código de barras</FormLabel>
              <FormControl>
                <div className="flex w-full max-w-sm items-center gap-2">
                  <Input placeholder="Código de barras" {...field} />
                  <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
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
                          field.onChange(result[0].rawValue);
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
