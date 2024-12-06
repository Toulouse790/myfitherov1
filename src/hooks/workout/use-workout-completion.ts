import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWorkoutCompletion = (sessionId: string | null, userId: string | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleConfirmEndWorkout = async (difficulty: "easy" | "medium" | "hard", duration: number) => {
    try {
      if (!sessionId || !userId) return;

      const { error: sessionError } = await supabase
        .from('workout_sessions')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;

      const { error: statsError } = await supabase
        .from('training_stats')
        .insert({
          user_id: userId,
          session_id: sessionId,
          duration_minutes: Math.round(duration / 60), // Convert seconds to minutes
          perceived_difficulty: difficulty,
          total_sets: 0,
          total_reps: 0,
          total_weight: 0
        });

      if (statsError) throw statsError;

      toast({
        title: "Séance terminée !",
        description: `Durée : ${Math.round(duration / 60)} minutes`,
      });

      navigate('/workouts');

    } catch (error) {
      console.error('Error ending workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer la séance",
        variant: "destructive",
      });
    }
  };

  return { handleConfirmEndWorkout };
};