import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateWorkoutPlan } from "@/components/Dashboard/WorkoutSuggestions/workoutPlanGenerator";

export const useWorkoutRegeneration = (sessionId: string | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegenerateWorkout = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!profile) {
        toast({
          title: "Profil incomplet",
          description: "Veuillez d'abord remplir le questionnaire initial",
          variant: "destructive",
        });
        return;
      }

      const userProfile = {
        age: 30,
        weight: 75,
        height: 175,
        goal: profile.objective,
        workoutsPerWeek: parseInt(profile.training_frequency),
        dailyCalories: 2000,
        recoveryCapacity: "low" as const
      };

      const newPlan = generateWorkoutPlan(userProfile);

      if (sessionId) {
        const { error: updateError } = await supabase
          .from('workout_sessions')
          .update({ 
            is_adapted: true,
            initial_energy_level: 'bad'
          })
          .eq('id', sessionId);

        if (updateError) throw updateError;
      }

      toast({
        title: "Programme adapté",
        description: "Un nouveau programme moins intense a été généré",
      });

      navigate(`/workouts/exercise/next-workout?session=${sessionId}`);
    } catch (error) {
      console.error('Error regenerating workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer un nouvel entraînement",
        variant: "destructive",
      });
    }
  };

  return { handleRegenerateWorkout };
};