import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const useWorkoutSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const createWorkoutSession = async (type: string) => {
    try {
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une séance",
          variant: "destructive",
        });
        return;
      }

      // First check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: user.id }]);

        if (insertError) {
          throw insertError;
        }
      }

      if (type === 'favorites') {
        navigate('/workouts');
        return;
      }

      // Définir les exercices de base selon le type
      const defaultExercises = type === 'quick' ? [
        "Extensions triceps",
        "Développé couché",
        "Squat"
      ] : [
        "Extensions triceps",
        "Développé couché", 
        "Squat",
        "Soulevé de terre",
        "Développé militaire"
      ];

      const workoutData = {
        user_id: user.id,
        workout_type: 'strength',
        status: 'in_progress',
        target_duration_minutes: type === 'quick' ? 30 : 45,
        exercises: defaultExercises,
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