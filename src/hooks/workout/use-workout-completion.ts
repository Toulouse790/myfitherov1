import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useWorkoutCompletion = (userId: string | undefined) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleConfirmEndWorkout = async (
    difficulty: string,
    duration: number,
    muscleGroups: string[]
  ) => {
    if (!userId) return;

    try {
      await supabase
        .from('training_stats')
        .insert({
          user_id: userId,
          perceived_difficulty: difficulty,
          session_duration_minutes: duration,
          muscle_groups_worked: muscleGroups
        });

      toast({
        title: "Séance terminée",
        description: "Vos statistiques ont été enregistrées",
      });

      navigate('/');
    } catch (error) {
      console.error('Error ending workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les statistiques",
        variant: "destructive",
      });
    }
  };

  return { handleConfirmEndWorkout };
};