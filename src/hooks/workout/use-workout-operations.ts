
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
          updated_at: new Date().toISOString(),
          total_duration_minutes: 0,
          total_weight_lifted: 0
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
      
      // Validation des données
      const safeUpdates: WorkoutSessionUpdate = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Valider la durée
      if (typeof safeUpdates.total_duration_minutes === 'number') {
        if (safeUpdates.total_duration_minutes < 0 || safeUpdates.total_duration_minutes > 300) {
          debugLogger.warn("WorkoutOperations", "Durée invalide détectée, correction", {
            original: safeUpdates.total_duration_minutes
          });
          safeUpdates.total_duration_minutes = Math.max(1, Math.min(safeUpdates.total_duration_minutes, 300));
        }
      }
      
      // Valider calories
      if (typeof safeUpdates.calories_burned === 'number') {
        if (safeUpdates.calories_burned < 0 || safeUpdates.calories_burned > 3000) {
          debugLogger.warn("WorkoutOperations", "Calories invalides détectées, correction", {
            original: safeUpdates.calories_burned
          });
          safeUpdates.calories_burned = Math.max(1, Math.min(safeUpdates.calories_burned, 3000));
        }
      }
      
      // Valider poids total
      if (typeof safeUpdates.total_weight_lifted === 'number') {
        if (safeUpdates.total_weight_lifted < 0 || safeUpdates.total_weight_lifted > 50000) {
          debugLogger.warn("WorkoutOperations", "Poids total invalide détecté, correction", {
            original: safeUpdates.total_weight_lifted
          });
          safeUpdates.total_weight_lifted = Math.max(0, Math.min(safeUpdates.total_weight_lifted, 50000));
        }
      }
      
      // Log détaillé des données envoyées à Supabase
      debugLogger.log("WorkoutOperations", "Données finales validées pour la mise à jour:", safeUpdates);
      
      const { data, error } = await supabase
        .from("workout_sessions")
        .update(safeUpdates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        debugLogger.error("WorkoutOperations", "Erreur lors de la mise à jour de la session:", error);
        
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
          
          // Récupérer les séries d'exercices pour calculer le poids total soulevé
          const { data: exerciseSets, error: exerciseSetsError } = await supabase
            .from('exercise_sets')
            .select('weight, reps')
            .eq('session_id', id);
            
          if (exerciseSetsError) {
            debugLogger.error("WorkoutOperations", "Erreur lors de la récupération des séries d'exercices:", exerciseSetsError);
          }
          
          // Calculer le poids total soulevé à partir des séries
          let calculatedTotalWeight = 0;
          if (exerciseSets && exerciseSets.length > 0) {
            calculatedTotalWeight = exerciseSets.reduce((total, set) => {
              const weight = set.weight || 0;
              const reps = set.reps || 0;
              return total + (weight * reps);
            }, 0);
            
            debugLogger.log("WorkoutOperations", "Poids total calculé à partir des séries:", calculatedTotalWeight);
          }
          
          // Si le poids calculé est supérieur à celui fourni, utiliser le calculé
          const finalTotalWeight = Math.max(
            calculatedTotalWeight,
            typeof updates.total_weight_lifted === 'number' ? updates.total_weight_lifted : 0
          );
          
          // Mise à jour du poids total dans la session si nécessaire
          if (finalTotalWeight > 0 && finalTotalWeight !== updates.total_weight_lifted) {
            const { error: weightUpdateError } = await supabase
              .from('workout_sessions')
              .update({ total_weight_lifted: finalTotalWeight })
              .eq('id', id);
              
            if (weightUpdateError) {
              debugLogger.error("WorkoutOperations", "Erreur lors de la mise à jour du poids total:", weightUpdateError);
            } else {
              debugLogger.log("WorkoutOperations", "Poids total mis à jour dans la session:", finalTotalWeight);
            }
          }
          
          // Préparation des données pour les statistiques
          const statsData = {
            user_id: user.id,
            session_id: id,
            perceived_difficulty: updates.perceived_difficulty || 'moderate',
            session_duration_minutes: updates.total_duration_minutes || 0,
            calories_burned: updates.calories_burned || 0,
            muscle_groups_worked: Array.isArray(updates.exercises) ? updates.exercises : [],
            total_weight_lifted: finalTotalWeight,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          debugLogger.log("WorkoutOperations", "Données statistiques préparées:", statsData);
          
          // Si des statistiques existent déjà, les mettre à jour, sinon les créer
          if (existingStats) {
            debugLogger.log("WorkoutOperations", "Mise à jour des statistiques existantes:", existingStats.id);
            
            const { data: updatedStats, error: statsUpdateError } = await supabase
              .from('training_stats')
              .update(statsData)
              .eq('id', existingStats.id)
              .select();
            
            if (statsUpdateError) {
              debugLogger.error("WorkoutOperations", "Erreur lors de la mise à jour des statistiques:", statsUpdateError);
            } else {
              debugLogger.log("WorkoutOperations", "Statistiques mises à jour avec succès:", updatedStats);
            }
          } else {
            debugLogger.log("WorkoutOperations", "Création de nouvelles statistiques");
            
            const { data: newStats, error: statsInsertError } = await supabase
              .from('training_stats')
              .insert([statsData])
              .select();
            
            if (statsInsertError) {
              debugLogger.error("WorkoutOperations", "Erreur lors de l'insertion des statistiques:", statsInsertError);
            } else {
              debugLogger.log("WorkoutOperations", "Nouvelles statistiques créées:", newStats);
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
            // Vérifier si la dernière activité était aujourd'hui
            const lastDate = streakData.last_activity_date;
            const isToday = lastDate === today;
            
            if (!isToday) {
              // Mise à jour du streak existant
              const { data: updatedStreak, error: updateStreakError } = await supabase
                .from('user_streaks')
                .update({
                  current_streak: streakData.current_streak + 1,
                  longest_streak: Math.max(streakData.longest_streak, streakData.current_streak + 1),
                  last_activity_date: today
                })
                .eq('id', streakData.id)
                .select();
                
              if (updateStreakError) {
                debugLogger.error("WorkoutOperations", "Erreur lors de la mise à jour du streak:", updateStreakError);
              } else {
                debugLogger.log("WorkoutOperations", "Streak mis à jour:", updatedStreak);
              }
            } else {
              debugLogger.log("WorkoutOperations", "Streak déjà mis à jour aujourd'hui, pas de mise à jour");
            }
          } else {
            // Création d'un nouveau streak
            const { data: newStreak, error: insertStreakError } = await supabase
              .from('user_streaks')
              .insert([{
                user_id: user.id,
                streak_type: 'workout',
                current_streak: 1,
                longest_streak: 1,
                last_activity_date: today
              }])
              .select();
              
            if (insertStreakError) {
              debugLogger.error("WorkoutOperations", "Erreur lors de la création du streak:", insertStreakError);
            } else {
              debugLogger.log("WorkoutOperations", "Nouveau streak créé:", newStreak);
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
              
              const { data: updatedProgression, error: updateProgressionError } = await supabase
                .from('user_progression')
                .update({
                  workout_points: progression.workout_points + workoutPoints,
                  total_points: progression.total_points + workoutPoints,
                  updated_at: new Date().toISOString()
                })
                .eq('id', progression.id)
                .select();
                
              if (updateProgressionError) {
                debugLogger.error("WorkoutOperations", "Erreur lors de la mise à jour de la progression:", updateProgressionError);
              } else {
                debugLogger.log("WorkoutOperations", "Progression mise à jour:", updatedProgression);
              }
            } else {
              // Créer une entrée de progression si elle n'existe pas
              const difficultyMultiplier = 
                updates.perceived_difficulty === 'easy' ? 1 :
                updates.perceived_difficulty === 'hard' ? 3 : 2;
                
              const workoutPoints = Math.round((updates.total_duration_minutes || 30) * difficultyMultiplier / 10);
              
              const { data: newProgression, error: createProgressionError } = await supabase
                .from('user_progression')
                .insert({
                  user_id: user.id,
                  workout_points: workoutPoints,
                  total_points: workoutPoints,
                  nutrition_points: 0,
                  sleep_points: 0,
                  current_level: 1,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .select();
                
              if (createProgressionError) {
                debugLogger.error("WorkoutOperations", "Erreur lors de la création de la progression:", createProgressionError);
              } else {
                debugLogger.log("WorkoutOperations", "Nouvelle progression créée:", newProgression);
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
