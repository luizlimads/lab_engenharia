'use client';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, Search, Trash2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ProductFilterValues {
  productName: string;
  category: string;
  unit: string;
  minQuantity: number;
  maxQuantity: number;
  validFrom?: Date;
  validTo?: Date;
}

export default function ProductFilterForm() {
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<ProductFilterValues>({
    defaultValues: {
      productName: '',
      category: 'all',
      unit: 'all',
      minQuantity: undefined,
      maxQuantity: undefined,
      validFrom: undefined,
      validTo: undefined,
    },
  });

  function onSubmit(data: ProductFilterValues) {
    console.log('Filter data:', data);
    // TODO: call API
  }

  function onReset() {
    reset();
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          Buscar Produtos
        </h1>

        <div className="space-y-1">
          <Label htmlFor="productName">Nome do produto</Label>
          <Input
            id="productName"
            placeholder="Digite o nome"
            {...register('productName')}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="category">Categoria</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="cat1">Categoria 1</SelectItem>
                  <SelectItem value="cat2">Categoria 2</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="unit">Unidade</Label>
          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Todas as unidades" />
                </SelectTrigger>
                <SelectContent>
                  {/* TODO: unidades */}
                  <SelectItem value="all">Todas as unidades</SelectItem>
                  <SelectItem value="unit1">Unidade 1</SelectItem>
                  <SelectItem value="unit2">Unidade 2</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="minQuantity">Quantidade mínima</Label>
            <Input
              id="minQuantity"
              type="number"
              min={0}
              step="any"
              {...register('minQuantity', { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="maxQuantity">Quantidade máxima</Label>
            <Input
              id="maxQuantity"
              type="number"
              min={0}
              step="any"
              {...register('maxQuantity', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label>Validade a partir de</Label>
          <Controller
            name="validFrom"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full cursor-pointer justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground',
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value
                      ? format(field.value, 'dd/MM/yyyy')
                      : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>

        <div className="space-y-1">
          <Label>Validade até</Label>
          <Controller
            name="validTo"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full cursor-pointer justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground',
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value
                      ? format(field.value, 'dd/MM/yyyy')
                      : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button type="submit" className="w-full cursor-pointer">
            <Search className="mr-2" /> Filtrar
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onReset}
            className="w-full cursor-pointer">
            <Trash2 className="mr-2" /> Limpar Filtros
          </Button>
        </div>
      </form>
    </div>
  );
}
