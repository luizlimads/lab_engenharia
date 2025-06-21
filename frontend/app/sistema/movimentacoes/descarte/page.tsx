'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
// import { DatePicker } from "@/components/ui/datepicker";
import { BarcodeScanner } from 'react-barcode-scanner';
import 'react-barcode-scanner/polyfill';
import { CalendarIcon, ScanBarcode } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

const formSchema = z.object({
  produto: z.string().min(2).max(100),
  categoria: z.enum(['perecivel', 'nao_perecivel']),
  unidade: z.enum(['kg', 'lata', 'caixa', 'L']),
  quantidade: z.number().min(1),
  validade: z.string().refine((date) => !!Date.parse(date), {
    message: 'Data de validade inválida',
  }),
  codigo: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export default function Cadastrar() {
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
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-3xl font-bold">Descarte</h1>
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
                      <SelectItem value="nao_perecivel">
                        Não perecível
                      </SelectItem>
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
                  <Input type="number" placeholder="Quantidade" {...field} />
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
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lata">lata</SelectItem>
                      <SelectItem value="caixa">caixa</SelectItem>
                    </SelectContent>
                  </Select>
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
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
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
                          options={{ formats: ['ean_13', 'upc_a'] }}
                          // onUpdate={(err, result) => {
                          //   if (result) {
                          //     form.setValue("codigo", result.text);
                          //     setScannerOpen(false);
                          //   }
                          // }}
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
          <Button type="submit" className="w-full">
            Descarte
          </Button>
        </div>
      </Form>
    </div>
  );
}
