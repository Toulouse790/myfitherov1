
import { useState } from "react";
import { BarcodeScanner } from "@/components/Nutrition/BarcodeScanner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanBarcode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BarcodeScannerDialogProps {
  onScanComplete: (barcode: string) => void;
}

export const BarcodeScannerDialog = ({ onScanComplete }: BarcodeScannerDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleScan = (barcode: string) => {
    onScanComplete(barcode);
    setOpen(false);
    toast({
      title: "Code-barres scanné",
      description: `Code: ${barcode}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ScanBarcode className="h-4 w-4" />
          <span>Scanner un produit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scanner un code-barres</DialogTitle>
          <DialogDescription>
            Placez le code-barres du produit alimentaire face à votre caméra
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          <BarcodeScanner onScan={handleScan} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
