
import { useState } from "react";
import { BarcodeScanner } from "@/components/Nutrition/BarcodeScanner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanBarcode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface BarcodeScannerDialogProps {
  onScanComplete: (barcode: string) => void;
}

export const BarcodeScannerDialog = ({ onScanComplete }: BarcodeScannerDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleScan = (barcode: string) => {
    onScanComplete(barcode);
    setOpen(false);
    toast({
      title: t("nutrition.scanComplete"),
      description: `${t("common.code")}: ${barcode}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ScanBarcode className="h-4 w-4" />
          <span>{t("nutrition.scanBarcode")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("nutrition.scanBarcode")}</DialogTitle>
          <DialogDescription>
            {t("nutrition.placeBarcodeInFront")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          <BarcodeScanner onScan={handleScan} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
