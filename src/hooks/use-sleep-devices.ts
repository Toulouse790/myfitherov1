
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConnectedDevice } from "./use-sleep-tracking";

export const useSleepDevices = () => {
  const { toast } = useToast();
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);

  // Fonction pour connecter un appareil
  const connectDevice = useCallback(async () => {
    try {
      // Vérification de l'API Web Bluetooth
      if (typeof window !== 'undefined' && !('bluetooth' in navigator)) {
        toast({
          title: "Non supporté",
          description: "Votre navigateur ne supporte pas le Bluetooth",
          variant: "destructive",
        });
        return;
      }

      // Simulation de connexion Bluetooth (car tous les navigateurs ne supportent pas Web Bluetooth)
      // Dans une application réelle, vous utiliseriez navigator.bluetooth.requestDevice()
      const mockDevice = {
        name: `Montre connectée (${Math.floor(Math.random() * 1000)})`,
        id: crypto.randomUUID()
      };
      
      // Ajouter l'appareil à la liste
      setConnectedDevices(prev => [
        ...prev,
        {
          id: mockDevice.id,
          name: mockDevice.name,
          type: mockDevice.name.includes('Fitbit') ? 'Fitbit' : 
                mockDevice.name.includes('Garmin') ? 'Garmin' : 
                mockDevice.name.includes('Apple') ? 'Apple Watch' : 'Autre',
          connected: true,
          lastSync: new Date().toISOString()
        }
      ]);

      toast({
        title: "Appareil connecté",
        description: `${mockDevice.name} connecté avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à l'appareil",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Fonction pour déconnecter un appareil
  const disconnectDevice = useCallback((deviceId: string) => {
    setConnectedDevices(prev => prev.filter(device => device.id !== deviceId));
    toast({
      title: "Appareil déconnecté",
      description: "L'appareil a été déconnecté avec succès",
    });
  }, [toast]);

  // Fonction pour synchroniser un appareil
  const syncDevice = useCallback((deviceId: string) => {
    setConnectedDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, lastSync: new Date().toISOString() }
        : device
    ));
    toast({
      title: "Synchronisation terminée",
      description: "Les données ont été synchronisées avec succès",
    });
  }, [toast]);

  return {
    connectedDevices,
    connectDevice,
    disconnectDevice,
    syncDevice
  };
};
