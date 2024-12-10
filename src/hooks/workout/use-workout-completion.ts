import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useWorkoutCompletion = (sessionId: string | null, userId: string | undefined) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleConfirmEndWorkout = async (
    difficulty: string,
    duration: number,
    muscleGroups: string[]
  ) => {
    if (!sessionId || !userId) {
      console.error("Session ID or User ID is missing");
      return;
    }

    try {
      // Mettre à jour le statut de la session
      await supabase
        .from('workout_sessions')
        .update({ status: 'completed' })
        .eq('id', sessionId);

      // Enregistrer les statistiques d'entraînement
      const { error: statsError } = await supabase
        .from('training_stats')
        .insert({
          user_id: userId,
          session_id: sessionId,
          session_duration_minutes: duration,
          perceived_difficulty: difficulty,
          muscle_groups_worked: muscleGroups,
        });

      if (statsError) throw statsError;

      toast({
        title: "Séance terminée !",
        description: "Vos statistiques ont été enregistrées avec succès.",
      });

      navigate('/');
    } catch (error) {
      console.error('Error ending workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les statistiques de la séance.",
        variant: "destructive",
      });
    }
  };

  return { handleConfirmEndWorkout };
};