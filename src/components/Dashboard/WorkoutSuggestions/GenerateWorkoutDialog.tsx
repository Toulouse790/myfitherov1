import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useExerciseFetching } from "@/hooks/use-exercise-fetching";
import { Button } from "@/components/ui/button";
import { generateWorkoutPlan } from "./workoutPlanGenerator";
import { GeneratedWorkoutPreview } from "./GeneratedWorkoutPreview";
import { WorkoutPlan } from "./workoutPlanGenerator";

interface GenerateWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkoutGenerated?: (workout: WorkoutPlan) => void;
}

export const GenerateWorkoutDialog = ({
  open,
  onOpenChange,
  onWorkoutGenerated
}: GenerateWorkoutDialogProps) => {
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutPlan | null>(null);
  const { toast } = useToast();
  const { fetchExercises } = useExerciseFetching();

  useEffect(() => {
    if (open) {
      const loadExercises = async () => {
        try {
          const exercises = await fetchExercises();
          setAvailableExercises(exercises);
        } catch (error) {
          console.error('Error loading exercises:', error);
          // On affiche une notification plus discrète
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger les exercices",
            variant: "destructive",
            duration: 2000, // Réduit la durée d'affichage
          });
          onOpenChange(false);
        }
      };
      loadExercises();
    } else {
      // Reset state when dialog closes
      setGeneratedWorkout(null);
    }
  }, [open, fetchExercises, toast, onOpenChange]);

  const handleGenerateWorkout = async () => {
    if (availableExercises.length === 0) {
      toast({
        title: "Information",
        description: "Aucun exercice disponible",
        duration: 2000,
      });
      return;
    }

    const workout = generateWorkoutPlan(availableExercises);
    setGeneratedWorkout(workout);
  };

  const handleConfirm = () => {
    if (generatedWorkout && onWorkoutGenerated) {
      onWorkoutGenerated(generatedWorkout);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Programme d'entraînement</DialogTitle>
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
              <GeneratedWorkoutPreview plan={generatedWorkout} />
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