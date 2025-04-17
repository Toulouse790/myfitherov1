
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

      // Vérifier si nous sommes en train de finaliser une session (status = completed)
      if (updates.status === 'completed') {
        // Créer ou mettre à jour les statistiques d'entraînement
        try {
          // Vérifier si une entrée existe déjà
          const { data: existingStats, error: statsCheckError } = await supabase
            .from('training_stats')
            .select('*')
            .eq('session_id', id)
            .maybeSingle();
            
          if (statsCheckError) {
            debugLogger.error("WorkoutOperations", "Erreur lors de la vérification des stats:", statsCheckError);
          }
          
          // Préparation des données pour les statistiques
          const statsData = {
            user_id: user.id,
            session_id: id,
            perceived_difficulty: updates.perceived_difficulty || 'moderate',
            session_duration_minutes: updates.total_duration_minutes || 0,
            calories_burned: updates.calories_burned || 0,
            muscle_groups_worked: Array.isArray(updates.exercises) ? updates.exercises : [],
            total_weight_lifted: updates.total_weight_lifted || 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // Si des statistiques existent déjà, les mettre à jour, sinon les créer
          if (existingStats) {
            const { error: statsUpdateError } = await supabase
              .from('training_stats')
              .update(statsData)
              .eq('id', existingStats.id);
            
            if (statsUpdateError) {
              debugLogger.error("WorkoutOperations", "Erreur lors de la mise à jour des statistiques:", statsUpdateError);
            }
          } else {
            const { error: statsInsertError } = await supabase
              .from('training_stats')
              .insert([statsData]);
            
            if (statsInsertError) {
              debugLogger.error("WorkoutOperations", "Erreur lors de l'insertion des statistiques:", statsInsertError);
            }
          }
          
          // Mettre à jour le streak de l'utilisateur
          const today = new Date().toISOString().split('T')[0];
          
          const { data: streakData, error: streakError } = await supabase
            .from('user_streaks')
            .select('*')
            .eq('user_id', user.id)
            .eq('streak_type', 'workout')
            .maybeSingle();
            
          if (streakError && streakError.code !== 'PGRST116') {
            debugLogger.error("WorkoutOperations", "Erreur lors de la récupération du streak:", streakError);
          }
          
          if (streakData) {
            // Mise à jour du streak existant
            const { error: updateStreakError } = await supabase
              .from('user_streaks')
              .update({
                current_streak: streakData.current_streak + 1,
                longest_streak: Math.max(streakData.longest_streak, streakData.current_streak + 1),
                last_activity_date: today
              })
              .eq('id', streakData.id);
              
            if (updateStreakError) {
              debugLogger.error("WorkoutOperations", "Erreur lors de la mise à jour du streak:", updateStreakError);
            }
          } else {
            // Création d'un nouveau streak
            const { error: insertStreakError } = await supabase
              .from('user_streaks')
              .insert([{
                user_id: user.id,
                streak_type: 'workout',
                current_streak: 1,
                longest_streak: 1,
                last_activity_date: today
              }]);
              
            if (insertStreakError) {
              debugLogger.error("WorkoutOperations", "Erreur lors de la création du streak:", insertStreakError);
            }
          }
          
          // Mise à jour de la progression utilisateur
          try {
            const { data: progression, error: progressionError } = await supabase
              .from('user_progression')
              .select('*')
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (progressionError) {
              debugLogger.error("WorkoutOperations", "Erreur lors de la récupération de la progression:", progressionError);
            } else if (progression) {
              // Calculer les points en fonction de la durée et de la difficulté
              const difficultyMultiplier = 
                updates.perceived_difficulty === 'easy' ? 1 :
                updates.perceived_difficulty === 'hard' ? 3 : 2;
                
              const workoutPoints = Math.round((updates.total_duration_minutes || 30) * difficultyMultiplier / 10);
              
              const { error: updateProgressionError } = await supabase
                .from('user_progression')
                .update({
                  workout_points: progression.workout_points + workoutPoints,
                  total_points: progression.total_points + workoutPoints,
                  updated_at: new Date().toISOString()
                })
                .eq('id', progression.id);
                
              if (updateProgressionError) {
                debugLogger.error("WorkoutOperations", "Erreur lors de la mise à jour de la progression:", updateProgressionError);
              }
            }
          } catch (progressionError) {
            debugLogger.error("WorkoutOperations", "Exception lors de la mise à jour de la progression:", progressionError);
          }
          
        } catch (statsError) {
          debugLogger.error("WorkoutOperations", "Erreur lors de la gestion des statistiques:", statsError);
        }
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
