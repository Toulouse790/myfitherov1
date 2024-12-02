import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
}

export const BarcodeScanner = ({ onScan }: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startScanning = async () => {
    try {
      const codeReader = new BrowserMultiFormatReader();
      const videoInputDevices = await codeReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        toast({
          title: "Erreur",
          description: "Aucune caméra détectée",
          variant: "destructive",
        });
        return;
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;
      
      if (videoRef.current) {
        codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
          if (result) {
            onScan(result.getText());
            codeReader.reset();
            toast({
              title: "Code-barres scanné",
              description: "Le produit a été trouvé",
            });
          }
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      const codeReader = new BrowserMultiFormatReader();
      codeReader.reset();
    };
  }, []);

  return (
    <div className="space-y-4">
      <Button onClick={startScanning} variant="outline" className="w-full gap-2">
        <Scan className="w-4 h-4" />
        Scanner un code-barres
      </Button>
      <video
        ref={videoRef}
        className="w-full aspect-video rounded-lg bg-muted"
      />
    </div>
  );
};