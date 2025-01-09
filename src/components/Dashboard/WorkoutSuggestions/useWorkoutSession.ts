import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useWorkoutSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const createWorkoutSession = async (type: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/signin');
        return;
      }

      if (type === 'favorites') {
        navigate('/workouts');
        return;
      }

      const workoutData = {
        user_id: session.user.id,
        type: 'strength',
        status: 'in_progress',
        target_duration_minutes: type === 'quick' ? 30 : 45,
        exercises: [],
        workout_type: type
      };

      const { data: workoutSession, error } = await supabase
        .from('workout_sessions')
        .insert([workoutData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (workoutSession) {
        console.log("Workout session created:", workoutSession);
        // Correction de la route de redirection
        navigate(`/workout/${workoutSession.id}`);
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