import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoadingButton } from "./GenerateWorkout/LoadingButton";
import { WorkoutActions } from "./GenerateWorkout/WorkoutActions";
import { GeneratedWorkoutPreview } from "./GeneratedWorkoutPreview";
import { generateWorkoutPlan } from "./workoutPlanGenerator";
import { useWorkoutSession } from "./useWorkoutSession";
import { useToast } from "@/hooks/use-toast";

export interface GenerateWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateWorkoutDialog = ({ isOpen, onClose }: GenerateWorkoutDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<string[] | null>(null);
  const { createWorkoutSession } = useWorkoutSession();
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const workoutPlan = generateWorkoutPlan([
        "Développé couché",
        "Squat",
        "Rowing barre",
        "Développé militaire",
        "Curl biceps",
        "Extensions triceps"
      ]);
      
      setGeneratedWorkout(workoutPlan.exercises.map(e => e.name));
      
      toast({
        title: "Séance générée !",
        description: "Votre séance a été générée avec succès.",
      });
    } catch (error) {
      console.error('Error generating workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la séance",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartWorkout = async () => {
    try {
      if (!generatedWorkout) return;
      await createWorkoutSession('quick');
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la séance",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-6">
          {!generatedWorkout ? (
            <LoadingButton
              isLoading={isGenerating}
              disabled={false}
              onClick={handleGenerate}
            />
          ) : (
            <>
              <GeneratedWorkoutPreview exercises={generatedWorkout} />
              <WorkoutActions
                onConfirm={handleStartWorkout}
                onRegenerate={handleGenerate}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};