
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SleepDevice } from "@/types/sleep";

// Ajoutons des appareils de sommeil fictifs pour la démonstration
const mockDevices: SleepDevice[] = [
  {
    id: "watch-001",
    name: "Apple Watch Series 7",
    type: "smartwatch",
    batteryLevel: 72,
    lastSync: new Date().toISOString(),
    connected: true
  }
];

export const useSleepDevices = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  // Ajout des appareils connectés
  const [connectedDevices, setConnectedDevices] = useState<SleepDevice[]>(mockDevices);

  const connectDevice = async () => {
    setIsConnecting(true);
    
    // Simulation d'une connexion
    setTimeout(() => {
      // Création d'un nouvel appareil fictif
      const newDevice: SleepDevice = {
        id: `watch-${Math.floor(Math.random() * 1000)}`,
        name: "Appareil de suivi du sommeil",
        type: "sleeptracker",
        batteryLevel: Math.floor(Math.random() * 100),
        lastSync: new Date().toISOString(),
        connected: true
      };
      
      // Ajout du nouvel appareil à la liste
      setConnectedDevices(prev => [...prev, newDevice]);
      setIsConnecting(false);
      
      toast({
        title: "Appareil connecté",
        description: "Votre appareil a été connecté avec succès.",
      });
    }, 1500);
  };

  const disconnectDevice = async (deviceId: string) => {
    // Suppression de l'appareil de la liste
    setConnectedDevices(prev => prev.filter(device => device.id !== deviceId));
    
    // Notification
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
    
    // Mise à jour de la date de dernière synchronisation
    setTimeout(() => {
      setConnectedDevices(prev => 
        prev.map(device => 
          device.id === deviceId 
            ? {...device, lastSync: new Date().toISOString()} 
            : device
        )
      );
      
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
    isConnecting,
    connectedDevices
  };
};
