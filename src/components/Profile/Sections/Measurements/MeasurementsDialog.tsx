import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MeasurementForm } from "./MeasurementForm";
import { MeasurementChart } from "./MeasurementChart";
import { MeasurementFormData, MeasurementHistory } from "./types";

export const MeasurementsDialog = () => {
  const [open, setOpen] = useState(false);
  const [measurements, setMeasurements] = useState<MeasurementFormData>({
    chest_cm: "",
    biceps_left_cm: "",
    biceps_right_cm: "",
    forearm_left_cm: "",
    forearm_right_cm: "",
    waist_cm: "",
    hips_cm: "",
    thigh_left_cm: "",
    thigh_right_cm: "",
    calf_left_cm: "",
    calf_right_cm: "",
  });
  const [history, setHistory] = useState<MeasurementHistory[]>([]);
  const [selectedMeasure, setSelectedMeasure] = useState("chest_cm");
  const { toast } = useToast();

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('muscle_measurements')
      .select('*')
      .eq('user_id', user.id)
      .order('measurement_date', { ascending: true });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des mesures",
        variant: "destructive",
      });
      return;
    }

    setHistory(data || []);
  };

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const measurementsData = Object.entries(measurements).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = parseFloat(value);
      }
      return acc;
    }, {} as Record<string, number>);

    const { error } = await supabase
      .from('muscle_measurements')
      .insert({
        user_id: user.id,
        ...measurementsData,
      });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les mesures",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Vos mesures ont été enregistrées",
    });

    fetchHistory();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => {
            fetchHistory();
          }}
        >
          Ajouter mes mensurations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mes mensurations</DialogTitle>
        </DialogHeader>
        
        <MeasurementForm 
          measurements={measurements}
          setMeasurements={setMeasurements}
        />

        <MeasurementChart 
          history={history}
          selectedMeasure={selectedMeasure}
          setSelectedMeasure={setSelectedMeasure}
        />

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};