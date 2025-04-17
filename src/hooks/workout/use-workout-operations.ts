
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";
import { WorkoutSessionUpdate } from "@/types/workout-session";
import { useLanguage } from "@/contexts/LanguageContext";

export const useWorkoutOperations = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Mutation pour commencer un nouvel entraînement
  const startWorkoutMutation = useMutation({
    mutationFn: async (exercises: string[]) => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      debugLogger.log("WorkoutOperations", "Création d'une nouvelle session d'entraînement");
      
      const { data, error } = await supabase
        .from("workout_sessions")
        .insert({
          user_id: user.id,
          exercises,
          status: "in_progress",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        debugLogger.error("WorkoutOperations", "Erreur lors de la création de la session:", error);
        throw error;
      }

      return data;
    }
  });

  // Mutation pour mettre à jour une session d'entraînement existante
  const updateWorkoutMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: WorkoutSessionUpdate }) => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      debugLogger.log("WorkoutOperations", "Mise à jour de la session d'entraînement:", { id, updates });
      
      // Toujours inclure updated_at avec la date actuelle
      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from("workout_sessions")
        .update(updatesWithTimestamp)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        debugLogger.error("WorkoutOperations", "Erreur lors de la mise à jour de la session:", error);
        throw error;
      }

      return data;
    }
  });

  const startWorkout = async (exercises: string[]) => {
    try {
      const data = await startWorkoutMutation.mutateAsync(exercises);
      debugLogger.log("WorkoutOperations", "Session d'entraînement créée avec succès:", data);
      return data;
    } catch (error) {
      debugLogger.error("WorkoutOperations", "Échec de la création de la session:", error);
      throw error;
    }
  };

  const updateWorkoutSession = async (id: string, updates: WorkoutSessionUpdate) => {
    try {
      const data = await updateWorkoutMutation.mutateAsync({ id, updates });
      debugLogger.log("WorkoutOperations", "Session d'entraînement mise à jour avec succès:", data);
      return data;
    } catch (error) {
      debugLogger.error("WorkoutOperations", "Échec de la mise à jour de la session:", error);
      throw error;
    }
  };

  return {
    isLoading: startWorkoutMutation.isPending || updateWorkoutMutation.isPending,
    startWorkout,
    updateWorkoutSession
  };
};
