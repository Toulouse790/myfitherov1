import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MeasurementForm } from "./MeasurementForm";
import { MeasurementFormData } from "./types";

interface MeasurementsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MeasurementsDialog = ({ isOpen, onOpenChange }: MeasurementsDialogProps) => {
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

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mes mensurations</DialogTitle>
        </DialogHeader>
        
        <MeasurementForm 
          measurements={measurements}
          setMeasurements={setMeasurements}
        />

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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