import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MeasurementForm } from "./MeasurementForm";
import { MeasurementFormData } from "./types";

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
  const { toast } = useToast();

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

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full mt-4"
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