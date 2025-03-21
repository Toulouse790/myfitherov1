
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface SleepDevice {
  id: string;
  name: string;
  type: string;
  batteryLevel: number;
  lastSync?: string;
  connected: boolean;
}

export const useSleepDevices = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const connectDevice = async () => {
    setIsConnecting(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsConnecting(false);
      
      toast({
        title: "Appareil connecté",
        description: "Votre montre a été connectée avec succès.",
      });
    }, 1500);
  };

  const disconnectDevice = async (deviceId: string) => {
    // Simulating API call
    toast({
      title: "Appareil déconnecté",
      description: "Votre appareil a été déconnecté avec succès.",
    });
  };

  const syncDevice = async (deviceId: string) => {
    toast({
      title: "Synchronisation en cours",
      description: "Les données de votre appareil sont en cours de synchronisation.",
    });
    
    // Simulating API call
    setTimeout(() => {
      toast({
        title: "Synchronisation terminée",
        description: "Les données ont été mises à jour avec succès.",
      });
    }, 2000);
  };

  return {
    connectDevice,
    disconnectDevice,
    syncDevice,
    isConnecting
  };
};
