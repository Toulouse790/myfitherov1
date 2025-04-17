
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";
import { WorkoutSessionUpdate } from "@/types/workout-session";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

export const useWorkoutOperations = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Mutation pour commencer un nouvel entraînement
  const startWorkoutMutation = useMutation({
    mutationFn: async (exercises: string[]) => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      debugLogger.log("WorkoutOperations", "Création d'une nouvelle session d'entraînement", {
        userId: user.id,
        exercises
      });
      
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

      debugLogger.log("WorkoutOperations", "Session créée avec succès:", data);
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
      
      // S'assurer que tous les timestamps nécessaires sont inclus
      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Log détaillé des données envoyées à Supabase
      debugLogger.log("WorkoutOperations", "Données finales pour la mise à jour:", updatesWithTimestamp);
      
      const { data, error } = await supabase
        .from("workout_sessions")
        .update(updatesWithTimestamp)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        debugLogger.error("WorkoutOperations", "Erreur lors de la mise à jour de la session:", error);
        
        // Notifier l'utilisateur de l'erreur
        toast({
          title: t("common.error") || "Erreur",
          description: t("workouts.errors.sessionUpdateFailed") || "Impossible de mettre à jour la session d'entraînement",
          variant: "destructive",
        });
        
        throw error;
      }

      debugLogger.log("WorkoutOperations", "Session mise à jour avec succès:", data);
      return data;
    }
  });

  const startWorkout = async (exercises: string[]) => {
    try {
      debugLogger.log("WorkoutOperations", "Démarrage de la session avec exercises:", exercises);
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
      debugLogger.log("WorkoutOperations", "Début de mise à jour de la session:", { id, updates });
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
    error: startWorkoutMutation.error || updateWorkoutMutation.error,
    startWorkout,
    updateWorkoutSession
  };
};
