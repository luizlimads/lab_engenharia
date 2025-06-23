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
import { Flashlight, ScanBarcode } from 'lucide-react';
import { useState } from 'react';
import { BarcodeScanner, useTorch } from 'react-barcode-scanner';
import 'react-barcode-scanner/polyfill';
import { toast } from 'sonner';

export default function DebugPage() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const { isTorchSupported, isTorchOn, setIsTorchOn } = useTorch();
  const onTorchSwitch = () => {
    setIsTorchOn(!isTorchOn);
  };
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Debug</h1>
      <div>
        <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <ScanBarcode /> Leitor de Código de Barras
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
                toast.success(
                  `Código de barras capturado: ${result[0].rawValue}`,
                );
              }}
            />
            {isTorchSupported ? (
              <Button variant="ghost" size="icon" onClick={onTorchSwitch}>
                <Flashlight className="h-5 w-5" />
              </Button>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
      <br />
      <Button onClick={() => toast.success('Success')}>Toast success</Button>
      <Button onClick={() => toast.error('Error')}>Toast error</Button>
    </div>
  );
}
