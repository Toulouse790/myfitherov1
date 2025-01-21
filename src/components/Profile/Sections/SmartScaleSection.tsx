import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, Bluetooth, BluetoothSearching } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SmartScaleSection = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const { data: scaleData } = useQuery({
    queryKey: ['smart-scale-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('smart_scale_data')
        .select('*')
        .order('measured_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data;
    }
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Simuler une connexion à la balance
      // À remplacer par la vraie logique de connexion selon le type de balance
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Balance connectée",
        description: "Votre balance est maintenant connectée à l'application",
      });
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de connecter la balance. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const lastMeasurement = scaleData?.[0];

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Scale className="w-5 h-5 text-primary" />
          Balance connectée
        </CardTitle>
        <Button 
          variant="default" 
          size="sm"
          onClick={handleConnect}
          disabled={isConnecting}
          className="bg-emerald hover:bg-emerald/90"
        >
          {isConnecting ? (
            <>
              <BluetoothSearching className="w-4 h-4 mr-2 animate-pulse" />
              Connexion...
            </>
          ) : (
            <>
              <Bluetooth className="w-4 h-4 mr-2" />
              Connecter
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {lastMeasurement ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Dernière mesure :</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Poids</span>
                  <span>{lastMeasurement.weight_kg} kg</span>
                  {lastMeasurement.body_fat_percentage && (
                    <>
                      <span className="text-muted-foreground">Masse grasse</span>
                      <span>{lastMeasurement.body_fat_percentage}%</span>
                    </>
                  )}
                  {lastMeasurement.muscle_mass_kg && (
                    <>
                      <span className="text-muted-foreground">Masse musculaire</span>
                      <span>{lastMeasurement.muscle_mass_kg} kg</span>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Autres mesures :</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {lastMeasurement.water_percentage && (
                    <>
                      <span className="text-muted-foreground">Hydratation</span>
                      <span>{lastMeasurement.water_percentage}%</span>
                    </>
                  )}
                  {lastMeasurement.bone_mass_kg && (
                    <>
                      <span className="text-muted-foreground">Masse osseuse</span>
                      <span>{lastMeasurement.bone_mass_kg} kg</span>
                    </>
                  )}
                  {lastMeasurement.metabolic_age && (
                    <>
                      <span className="text-muted-foreground">Âge métabolique</span>
                      <span>{lastMeasurement.metabolic_age} ans</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {scaleData && scaleData.length > 1 && (
              <div className="pt-4">
                <div className="flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-primary" />
                  <p className="text-sm font-medium">Évolution du poids</p>
                </div>
                {/* Ici nous pourrions ajouter un graphique d'évolution */}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Connectez votre balance pour synchroniser vos mesures
          </p>
        )}
      </CardContent>
    </Card>
  );
};