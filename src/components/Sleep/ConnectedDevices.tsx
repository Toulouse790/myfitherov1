
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSleepTracking } from "@/hooks/use-sleep-tracking";
import { Watch, Trash2, BatteryFull, RefreshCw } from "lucide-react";

export const ConnectedDevices = () => {
  const { connectedDevices, connectDevice } = useSleepTracking();

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return "Jamais";
    
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          {connectedDevices && connectedDevices.length > 0 ? (
            <div className="space-y-3">
              {connectedDevices.map(device => (
                <div key={device.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Watch className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Dernière synchronisation: {formatLastSync(device.lastSync)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" title="Synchroniser">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Batterie">
                      <BatteryFull className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Supprimer">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">
              Aucun appareil connecté
            </p>
          )}

          <Button
            onClick={connectDevice}
            variant={connectedDevices.length > 0 ? "outline" : "default"}
            className="w-full"
          >
            {connectedDevices.length > 0 ? "Connecter un autre appareil" : "Connecter un appareil"}
          </Button>
          
          {connectedDevices.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Les données de votre montre seront automatiquement synchronisées
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
