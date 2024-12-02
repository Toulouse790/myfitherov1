import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Watch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ConnectedDevices = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const connectDevice = async () => {
    try {
      // Vérifie si le navigateur supporte le Web Bluetooth
      if (!navigator.bluetooth) {
        toast({
          title: "Non supporté",
          description: "Votre navigateur ne supporte pas le Bluetooth",
          variant: "destructive",
        });
        return;
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { services: ['health_thermometer'] },
          { namePrefix: 'Fitbit' },
          { namePrefix: 'Garmin' },
          { namePrefix: 'Apple Watch' }
        ],
        optionalServices: ['battery_service']
      });

      setIsConnected(true);
      toast({
        title: "Appareil connecté",
        description: `${device.name} connecté avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à l'appareil",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Watch className="w-5 h-5" />
          Appareils connectés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={connectDevice}
            variant={isConnected ? "outline" : "default"}
            className="w-full"
          >
            {isConnected ? "Appareil connecté" : "Connecter un appareil"}
          </Button>
          {isConnected && (
            <p className="text-sm text-muted-foreground">
              Les données de votre montre seront automatiquement synchronisées
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};