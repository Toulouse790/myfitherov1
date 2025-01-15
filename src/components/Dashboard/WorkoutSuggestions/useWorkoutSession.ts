import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useWorkoutSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const createWorkoutSession = async (type: string) => {
    try {
      // Temporairement, on utilise un ID utilisateur factice pour le développement
      const mockUserId = "00000000-0000-0000-0000-000000000000";

      if (type === 'favorites') {
        navigate('/workouts');
        return;
      }

      const workoutData = {
        user_id: mockUserId,
        workout_type: 'strength',
        status: 'in_progress',
        target_duration_minutes: type === 'quick' ? 30 : 45,
        exercises: [],
      };

      const { data: workoutSession, error } = await supabase
        .from('workout_sessions')
        .insert(workoutData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (workoutSession) {
        console.log("Workout session created:", workoutSession);
        navigate(`/workouts/${workoutSession.id}`);
      }
    } catch (error) {
      console.error('Error creating workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance",
        variant: "destructive",
      });
    }
  };

  return { createWorkoutSession };
};