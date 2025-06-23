'use client';
import React, { useState } from 'react';
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
import {
  CalendarIcon,
  Flashlight,
  ScanBarcode,
  Search,
  Trash2,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, set } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@radix-ui/react-dialog';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BarcodeScanner, useTorch } from 'react-barcode-scanner';
import 'react-barcode-scanner/polyfill';
import { toast } from 'sonner';

interface ProductFilterValues {
  productId?: string | number;
  productName: string;
  barcode?: string;
  category: string;
  unit: string;
  minQuantity?: string | number;
  maxQuantity?: string | number;
  validFrom?: Date;
  validTo?: Date;
}

export default function ProductFilterForm() {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const { isTorchSupported, isTorchOn, setIsTorchOn } = useTorch();
  const onTorchSwitch = () => {
    setIsTorchOn(!isTorchOn);
  };

  const { handleSubmit, control, register, reset } =
    useForm<ProductFilterValues>({
      defaultValues: {
        productId: '',
        productName: '',
        barcode: '',
        category: 'all',
        unit: 'all',
        minQuantity: '',
        maxQuantity: '',
        validFrom: undefined,
        validTo: undefined,
      },
    });

  async function onSubmit(data: ProductFilterValues) {
    setIsLoading(true);
    setError(null);
    setTouched(true);

    try {
      // Build search parameters object
      const searchParams: Record<string, string> = {};

      // Add ID filter if provided
      if (
        data.productId &&
        data.productId !== '' &&
        !isNaN(Number(data.productId))
      ) {
        searchParams.id = data.productId.toString();
      }

      // Add barcode filter if provided
      if (data.barcode && data.barcode.trim()) {
        searchParams.barcode = data.barcode.trim();
      }

      // Add name filter if provided
      if (data.productName && data.productName.trim()) {
        searchParams.name = data.productName.trim();
      }

      // Add category filter if not 'all'
      if (data.category && data.category !== 'all') {
        searchParams.category = data.category;
      }

      // Add unit filter if not 'all'
      if (data.unit && data.unit !== 'all') {
        searchParams.unit = data.unit;
      }

      // Add quantity filters if provided
      if (
        data.minQuantity &&
        data.minQuantity !== '' &&
        !isNaN(Number(data.minQuantity))
      ) {
        searchParams.minQuantity = data.minQuantity.toString();
      }
      if (
        data.maxQuantity &&
        data.maxQuantity !== '' &&
        !isNaN(Number(data.maxQuantity))
      ) {
        searchParams.maxQuantity = data.maxQuantity.toString();
      }

      // Add date filters if provided
      if (data.validFrom) {
        searchParams.validFrom = data.validFrom.toISOString().split('T')[0];
      }
      if (data.validTo) {
        searchParams.validTo = data.validTo.toISOString().split('T')[0];
      }

      const response = null
      // @ts-ignore
      setSearchResults(response);
      console.log('Search results:', response); // Debug log
    } catch (err) {
      console.error('Search error:', err); // Debug log
      toast.error(
        'Erro ao buscar produtos. Verifique os filtros e tente novamente.',
      );
      setError(err instanceof Error ? err.message : 'Erro ao buscar produtos');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  function onReset() {
    reset();
    setSearchResults([]);
    setError(null);
  }

  return (
    <div className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          Buscar <p></p>rodutos
        </h1>

        <div className="space-y-1">
          <Label htmlFor="productId">ID do produto</Label>
          <Input
            id="productId"
            type="number"
            placeholder="Digite o ID"
            {...register('productId')}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="productName">Nome do produto</Label>
          <Input
            id="productName"
            placeholder="Digite o nome"
            {...register('productName')}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="barcode">Código de barras</Label>
          <div className="flex gap-2">
            <Input
              id="barcode"
              placeholder="Digite o código de barras"
              {...register('barcode')}
              className="flex-1"
            />
            <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <ScanBarcode />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Scanner de código de barras</DialogTitle>
                </DialogHeader>
                <div className="relative">
                  <Controller
                    name="barcode"
                    control={control}
                    render={({ field }) => (
                      <>
                        <BarcodeScanner
                          options={{
                            formats: ['ean_13', 'upc_a', 'qr_code', 'code_128'],
                            delay: 500,
                          }}
                          onCapture={(result) => {
                            if (result && result.length > 0) {
                              field.onChange(result[0].rawValue);
                              setScannerOpen(false);
                            }
                          }}
                          onError={(error) => {
                            console.error('Barcode scanner error:', error);
                          }}
                        />
                        {isTorchSupported && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={onTorchSwitch}
                              className="bg-black/50 text-white hover:bg-black/70">
                              <Flashlight
                                className={`h-5 w-5 ${isTorchOn ? 'text-yellow-400' : ''}`}
                              />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                  <SelectItem value="perecivel">Perecível</SelectItem>
                  <SelectItem value="nao_perecivel">Não Perecível</SelectItem>
                  <SelectItem value="congelado">Congelado</SelectItem>
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
                  <SelectItem value="all">Todas as unidades</SelectItem>
                  
                    <SelectItem >
null
                    </SelectItem>

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
              {...register('minQuantity')}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="maxQuantity">Quantidade máxima</Label>
            <Input
              id="maxQuantity"
              type="number"
              min={0}
              step="any"
              {...register('maxQuantity')}
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
            onClick={() => {
              onReset();
              setTouched(false);
            }}
            className="w-full cursor-pointer">
            <Trash2 className="mr-2" /> Limpar Filtros
          </Button>
        </div>
      </form>

      {isLoading && (
        <div className="mt-8 text-center">
          <p>Carregando resultados...</p>
        </div>
      )}

      {!isLoading && touched && searchResults.length === 0 && !error && (
        <div className="mt-8 text-center">
          <Card>
            <CardContent>
              <p>Nenhum produto encontrado com os filtros aplicados.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900 dark:text-red-200">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && searchResults.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">
            Resultados ({searchResults.length})
          </h2>
          <div className="space-y-4">
            {searchResults.map((product) => (
              <div key={product.id} className="rounded-md border p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {product.id}
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        Código de barras:{' '}
                      </span>
                      <span className="font-mono">{product.barcode}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        Categoria:{' '}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          product.category === 'perecivel'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                        {product.category === 'perecivel'
                          ? 'Perecível'
                          : 'Não Perecível'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        Unidade:{' '}
                      </span>
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {product.unit}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {product.inventory && product.inventory.length > 0 ? (
                      <>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            Quantidade Total:{' '}
                          </span>
                          <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {product.inventory.reduce(
                              (sum, item) => sum + item.quantity,
                              0,
                            )}{' '}
                            {product.unit}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            Lotes em Estoque:{' '}
                          </span>
                          <span className="font-medium">
                            {product.inventory.length}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm font-medium text-red-600 dark:text-red-400">
                        Sem estoque disponível
                      </div>
                    )}
                  </div>
                </div>

                {product.inventory && product.inventory.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-200">
                      Detalhes do Estoque:
                    </h4>
                    <div className="max-h-40 space-y-2 overflow-y-auto">
                      {product.inventory
                        .sort(
                          (a, b) =>
                            new Date(a.expirationDate || 0).getTime() -
                            new Date(b.expirationDate || 0).getTime(),
                        )
                        .map((item, index) => (
                          <div
                            key={item.id || index}
                            className="flex items-center justify-between rounded bg-gray-50 p-2 text-sm dark:bg-gray-800">
                            <div className="flex gap-4">
                              <span>
                                <span className="font-medium text-gray-600 dark:text-gray-300">
                                  Lote {index + 1}:
                                </span>
                                <span className="ml-1 font-semibold">
                                  {item.quantity}&nbsp;{product.unit}
                                </span>
                              </span>
                              <span>
                                <span className="font-medium text-gray-600 dark:text-gray-300">
                                  Validade:
                                </span>
                                <span
                                  className={`ml-1 font-medium ${
                                    new Date(item.expirationDate || 0) <
                                    new Date()
                                      ? 'text-red-600 dark:text-red-400'
                                      : new Date(item.expirationDate || 0) <
                                          new Date(
                                            Date.now() +
                                              30 * 24 * 60 * 60 * 1000,
                                          )
                                        ? 'text-orange-600 dark:text-orange-400'
                                        : 'text-green-600 dark:text-green-400'
                                  }`}>
                                  {item.expirationDate
                                    ? format(
                                        new Date(item.expirationDate),
                                        'dd/MM/yyyy',
                                      )
                                    : 'N/D'}
                                </span>
                              </span>
                            </div>
                            {item.expirationDate &&
                              new Date(item.expirationDate) < new Date() && (
                                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                                  Vencido
                                </span>
                              )}
                            {item.expirationDate &&
                              new Date(item.expirationDate) >= new Date() &&
                              new Date(item.expirationDate) <
                                new Date(
                                  Date.now() + 30 * 24 * 60 * 60 * 1000,
                                ) && (
                                <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                  Vencimento próximo
                                </span>
                              )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
