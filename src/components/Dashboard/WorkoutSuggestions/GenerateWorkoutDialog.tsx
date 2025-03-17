
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoadingButton } from "./GenerateWorkout/LoadingButton";
import { WorkoutActions } from "./GenerateWorkout/WorkoutActions";
import { GeneratedWorkoutPreview } from "./GeneratedWorkoutPreview";
import { generateWorkoutPlan } from "./workoutPlanGenerator";
import { useSessionActions } from "@/hooks/workout/use-session-actions";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export interface GenerateWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateWorkoutDialog = ({ isOpen, onClose }: GenerateWorkoutDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<string[] | null>(null);
  const { createWorkoutSession } = useSessionActions();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      
      // Default profile for demonstration - in production this should come from user preferences
      const defaultProfile = {
        age: 30,
        weight: 70,
        height: 175,
        goal: 'muscle_gain',
        workoutsPerWeek: 3,
        dailyCalories: 2500,
        recoveryCapacity: 'medium' as const,
        experienceLevel: 'intermediate',
        availableEquipment: 'full_gym'
      };

      const workoutPlan = await generateWorkoutPlan([
        "Développé couché",
        "Squat",
        "Rowing barre",
        "Développé militaire",
        "Curl biceps",
        "Extensions triceps"
      ], 
      defaultProfile,
      []  // Empty array for muscle recovery status
      );
      
      setGeneratedWorkout(workoutPlan.exercises.map(e => e.name));
      
      toast({
        title: "Séance générée !",
        description: "Votre séance a été générée avec succès.",
        duration: 1000,
      });
    } catch (error) {
      console.error('Error generating workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la séance",
        variant: "destructive",
        duration: 1000,
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
        duration: 1000,
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
