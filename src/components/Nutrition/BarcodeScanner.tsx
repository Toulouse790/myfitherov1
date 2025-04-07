
import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
}

export const BarcodeScanner = ({ onScan }: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader>();
  const { toast } = useToast();
  const { t } = useLanguage();

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
          title: t("common.error"),
          description: t("nutrition.noCameraDetected"),
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
                title: t("nutrition.scanComplete"),
                description: t("nutrition.productFound"),
              });
            }
          }
        );
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("nutrition.cameraAccessError"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden bg-white shadow-sm mt-4">
      <div className="p-2">
        <Button 
          onClick={startScanning} 
          variant="outline" 
          className="w-full gap-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 text-sm py-2"
        >
          <Scan className="w-4 h-4" />
          {t("nutrition.scanBarcode")}
        </Button>
      </div>
      <video
        ref={videoRef}
        className="w-full h-48 bg-gray-100"
      />
    </Card>
  );
};
