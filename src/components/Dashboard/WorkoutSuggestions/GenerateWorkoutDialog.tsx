import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { GeneratedWorkoutPreview } from "./GeneratedWorkoutPreview";
import { LoadingButton } from "./GenerateWorkout/LoadingButton";
import { WorkoutActions } from "./GenerateWorkout/WorkoutActions";

interface GenerateWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateWorkoutDialog = ({
  isOpen,
  onClose,
}: GenerateWorkoutDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<string[] | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartWorkout = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour commencer une séance",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          exercises: generatedWorkout,
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;

      if (session) {
        navigate(`/workouts/${session.id}`);
        onClose();
      }
    } catch (error) {
      console.error('Error creating workout session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance d'entraînement",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulation d'une génération d'entraînement
    setTimeout(() => {
      setGeneratedWorkout([
        "Développé couché",
        "Rowing barre",
        "Squat",
        "Développé épaules"
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="space-y-6 py-4">
          {!generatedWorkout ? (
            <LoadingButton
              isLoading={isGenerating}
              onClick={handleGenerate}
            />
          ) : (
            <>
              <GeneratedWorkoutPreview exercises={generatedWorkout} />
              <WorkoutActions
                onStartWorkout={handleStartWorkout}
                onRegenerate={handleGenerate}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};