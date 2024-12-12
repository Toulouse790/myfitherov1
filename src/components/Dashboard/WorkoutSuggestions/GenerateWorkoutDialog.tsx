import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useExerciseFetching } from "@/hooks/use-exercise-fetching";
import { Button } from "@/components/ui/button";
import { generateWorkoutPlan } from "./workoutPlanGenerator";
import { GeneratedWorkoutPreview } from "./GeneratedWorkoutPreview";
import { WorkoutPlan } from "./workoutPlanGenerator";
import { Loader2 } from "lucide-react";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { fetchExercises } = useExerciseFetching();

  useEffect(() => {
    if (open) {
      const loadExercises = async () => {
        try {
          console.log("Chargement des exercices disponibles...");
          const exercises = await fetchExercises();
          console.log(`${exercises.length} exercices chargés avec succès`);
          setAvailableExercises(exercises);
        } catch (error) {
          console.error('Erreur lors du chargement des exercices:', error);
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger les exercices",
            variant: "destructive",
            duration: 2000,
          });
          onOpenChange(false);
        }
      };
      loadExercises();
    } else {
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

    setIsGenerating(true);
    console.log("Génération du programme d'entraînement...");
    
    try {
      const workout = generateWorkoutPlan(availableExercises);
      console.log("Programme généré avec succès:", workout);
      setGeneratedWorkout(workout);
      toast({
        title: "Succès",
        description: "Programme d'entraînement généré avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le programme",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirm = () => {
    if (generatedWorkout && onWorkoutGenerated) {
      console.log("Confirmation du programme généré");
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
              disabled={availableExercises.length === 0 || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                "Générer un programme"
              )}
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