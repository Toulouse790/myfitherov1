import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
}

export const BarcodeScanner = ({ onScan }: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader>();
  const { toast } = useToast();

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    
    return () => {
      if (codeReaderRef.current) {
        const videoElement = videoRef.current;
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
        codeReaderRef.current = undefined;
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader();
      }

      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      
      if (devices.length === 0) {
        toast({
          title: "Erreur",
          description: "Aucune caméra détectée",
          variant: "destructive",
        });
        return;
      }

      const selectedDeviceId = devices[0].deviceId;
      
      if (videoRef.current) {
        await codeReaderRef.current.decodeFromVideoDevice(
          selectedDeviceId, 
          videoRef.current, 
          (result, err) => {
            if (result) {
              onScan(result.getText());
              const videoElement = videoRef.current;
              if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
              }
              codeReaderRef.current = undefined;
              toast({
                title: "Code-barres scanné",
                description: "Le produit a été trouvé",
              });
            }
          }
        );
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden bg-white shadow-sm">
      <div className="p-4">
        <Button 
          onClick={startScanning} 
          variant="outline" 
          className="w-full gap-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
        >
          <Scan className="w-4 h-4" />
          Scanner un code-barres
        </Button>
      </div>
      <video
        ref={videoRef}
        className="w-full aspect-video bg-gray-100"
      />
    </Card>
  );
};