import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

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
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos mensurations",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setMeasurements(data);
    }
  };

  const handleSave = async (newMeasurements: Measurements) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('muscle_measurements')
      .insert({
        user_id: user.id,
        ...newMeasurements,
      });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos mensurations",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Vos mensurations ont été sauvegardées",
    });
    
    setIsEditing(false);
    fetchLatestMeasurements();
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

      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => setIsEditing(true)}
      >
        {measurements ? 'Mettre à jour' : 'Ajouter mes mensurations'}
      </Button>
    </div>
  );
};