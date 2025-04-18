import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MeasurementsDialog } from "./Measurements/MeasurementsDialog";
import { useState } from "react";
import { MeasurementChart } from "./Measurements/MeasurementChart";

export const MeasurementsSection = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedMeasure, setSelectedMeasure] = useState<string>("weight_kg");

  const { data: measurements } = useQuery({
    queryKey: ['latest-measurements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('muscle_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching measurements:', error);
        return null;
      }

      return data;
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Mesures corporelles
        </CardTitle>
        <Button onClick={() => setShowDialog(true)} variant="outline" size="sm">
          Ajouter une mesure
        </Button>
      </CardHeader>
      <CardContent>
        {measurements ? (
          <div className="space-y-4">
            <MeasurementChart 
              history={measurements}
              selectedMeasure={selectedMeasure}
              setSelectedMeasure={setSelectedMeasure}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Dernières mesures :</p>
                <ul className="text-sm">
                  {measurements[0]?.chest_cm && (
                    <li>Poitrine : {measurements[0].chest_cm} cm</li>
                  )}
                  {measurements[0]?.biceps_left_cm && (
                    <li>Biceps G : {measurements[0].biceps_left_cm} cm</li>
                  )}
                  {measurements[0]?.biceps_right_cm && (
                    <li>Biceps D : {measurements[0].biceps_right_cm} cm</li>
                  )}
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Autres mesures :</p>
                <ul className="text-sm">
                  {measurements[0]?.waist_cm && (
                    <li>Tour de taille : {measurements[0].waist_cm} cm</li>
                  )}
                  {measurements[0]?.thigh_left_cm && (
                    <li>Cuisse G : {measurements[0].thigh_left_cm} cm</li>
                  )}
                  {measurements[0]?.thigh_right_cm && (
                    <li>Cuisse D : {measurements[0].thigh_right_cm} cm</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucune mesure enregistrée. Ajoutez votre première mesure !
          </p>
        )}
      </CardContent>
      <MeasurementsDialog 
        isOpen={showDialog} 
        onOpenChange={setShowDialog}
      />
    </Card>
  );
};