import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight } from "lucide-react";
import { MeasurementsDialog } from "./Measurements/MeasurementsDialog";

interface Measurements {
  chest_cm: number | null;
  biceps_left_cm: number | null;
  biceps_right_cm: number | null;
  forearm_left_cm: number | null;
  forearm_right_cm: number | null;
  waist_cm: number | null;
  hips_cm: null;
  thigh_left_cm: number | null;
  thigh_right_cm: number | null;
  calf_left_cm: number | null;
  calf_right_cm: number | null;
}

export const MeasurementsSection = () => {
  const [measurements, setMeasurements] = useState<Measurements | null>(null);

  useEffect(() => {
    fetchLatestMeasurements();
  }, []);

  const fetchLatestMeasurements = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('muscle_measurements')
      .select('*')
      .eq('user_id', user.id)
      .order('measurement_date', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      setMeasurements(data[0]);
    }
  };

  const renderMeasurement = (label: string, value: number | null) => (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value ? `${value} cm` : '-'}</span>
    </div>
  );

  return (
    <div className="p-6 hover:bg-accent/10 rounded-lg transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Mensurations</h2>
          <p className="text-sm text-muted-foreground">
            Suivez l'évolution de vos mensurations
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>

      {measurements && (
        <div className="space-y-2">
          {renderMeasurement("Poitrine", measurements.chest_cm)}
          {renderMeasurement("Biceps gauche", measurements.biceps_left_cm)}
          {renderMeasurement("Biceps droit", measurements.biceps_right_cm)}
          {renderMeasurement("Avant-bras gauche", measurements.forearm_left_cm)}
          {renderMeasurement("Avant-bras droit", measurements.forearm_right_cm)}
          {renderMeasurement("Tour de taille", measurements.waist_cm)}
          {renderMeasurement("Hanches", measurements.hips_cm)}
          {renderMeasurement("Cuisse gauche", measurements.thigh_left_cm)}
          {renderMeasurement("Cuisse droite", measurements.thigh_right_cm)}
          {renderMeasurement("Mollet gauche", measurements.calf_left_cm)}
          {renderMeasurement("Mollet droit", measurements.calf_right_cm)}
        </div>
      )}

      <MeasurementsDialog />
    </div>
  );
};