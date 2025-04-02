
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { WorkoutSession, WorkoutSessionUpdate } from "@/types/workout-session";
import { useLanguage } from "@/contexts/LanguageContext";

export const useWorkoutOperations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const startWorkout = async (programId?: string, exercises?: string[]) => {
    if (!user) {
      toast({
        title: t("auth.error"),
        description: t("auth.sessionExpired"),
        variant: "destructive",
      });
      navigate('/sign-in');
      return null;
    }

    try {
      setIsLoading(true);
      console.log("Démarrage de l'entraînement avec exercices:", exercises);
      
      // Create a new workout session with the correct fields
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([{
          user_id: user.id,
          program_id: programId || null,
          exercises: exercises || [],
          total_duration_minutes: 0,
          status: 'in_progress',
          perceived_difficulty: 'moderate',
          type: 'strength',
          workout_type: 'strength'
        }])
        .select()
        .single();

      if (error) {
        console.error("Erreur création session:", error);
        throw error;
      }
      
      console.log("Session créée avec succès:", data);
      
      // Redirect to the appropriate page
      if (programId) {
        navigate(`/workouts/start/${programId}`);
      } else {
        navigate(`/workouts/${data.id}`);
      }
      
      return data;
    } catch (error) {
      console.error(t("workouts.errors.sessionCreate"), error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.sessionCreateDescription"),
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkoutSession = async (sessionId: string, updates: WorkoutSessionUpdate) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(t("workouts.errors.sessionUpdate"), error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.sessionUpdateDescription"),
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    startWorkout,
    updateWorkoutSession
  };
};
