import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useExerciseFetching } from "@/hooks/use-exercise-fetching";
import { Button } from "@/components/ui/button";
import { generateWorkoutPlan } from "./workoutPlanGenerator";
import { GeneratedWorkoutPreview } from "./GeneratedWorkoutPreview";

interface GenerateWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkoutGenerated: (workout: any) => void;
}

export const GenerateWorkoutDialog = ({
  open,
  onOpenChange,
  onWorkoutGenerated
}: GenerateWorkoutDialogProps) => {
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const { toast } = useToast();
  const { fetchExercises } = useExerciseFetching();

  useEffect(() => {
    if (open) {
      const loadExercises = async () => {
        const exercises = await fetchExercises();
        setAvailableExercises(exercises);
      };
      loadExercises();
    }
  }, [open]);

  const handleGenerateWorkout = async () => {
    if (availableExercises.length === 0) {
      toast({
        title: "Erreur",
        description: "Aucun exercice disponible",
        variant: "destructive",
      });
      return;
    }

    const workout = generateWorkoutPlan(availableExercises);
    setGeneratedWorkout(workout);
  };

  const handleConfirm = () => {
    if (generatedWorkout) {
      onWorkoutGenerated(generatedWorkout);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Générer un programme</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!generatedWorkout ? (
            <Button 
              onClick={handleGenerateWorkout}
              className="w-full"
              disabled={availableExercises.length === 0}
            >
              Générer un programme
            </Button>
          ) : (
            <div className="space-y-4">
              <GeneratedWorkoutPreview workout={generatedWorkout} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setGeneratedWorkout(null)}>
                  Regénérer
                </Button>
                <Button onClick={handleConfirm}>
                  Confirmer
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};