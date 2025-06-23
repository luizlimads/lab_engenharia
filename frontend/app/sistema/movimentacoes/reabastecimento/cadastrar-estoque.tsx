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
import { Unit, Units } from '@/services/units';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Flashlight, ScanBarcode } from 'lucide-react';
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
  nome: z.string().min(1, 'Nome do produto é obrigatório'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
  data_validade: z.string().refine(
    (date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
    },
    {
      message: 'Data de validade deve ser uma data futura válida',
    },
  ),
  quantidade: z.number().min(1, 'Quantidade deve ser maior que 0'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CadastrarEstoque() {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      categoria: '',
      unidade: '',
      data_validade: '',
      quantidade: 1,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      // Ajuste para o formato esperado pelo backend
      const payload = {
        nome: data.nome,
        categoria: data.categoria,
        unidade: data.unidade,
        data_validade: data.data_validade,
        quantidade: data.quantidade,
      };
      await apiClient('/produtos/create', {
        method: 'POST',
        body: payload,
      });
      form.reset();
      toast.success('Produto cadastrado com sucesso!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Erro: ${error.message}`);
      } else {
        toast.error('Erro ao cadastrar produto.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Produto</FormLabel>
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
                  <Input placeholder="Categoria" {...field} />
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
                  <Input placeholder="Unidade (ex: kg, un, l)" {...field} />
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
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data_validade"
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
                          ? format(
                              new Date(field.value + 'T00:00:00'),
                              'dd/MM/yyyy',
                            )
                          : 'Selecione uma data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value
                            ? new Date(field.value + 'T00:00:00')
                            : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            // Format date as YYYY-MM-DD in local timezone
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              '0',
                            );
                            const day = String(date.getDate()).padStart(2, '0');
                            field.onChange(`${year}-${month}-${day}`);
                          } else {
                            field.onChange('');
                          }
                        }}
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
            className="w-full cursor-pointer"
            disabled={submitting}>
            {submitting ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
