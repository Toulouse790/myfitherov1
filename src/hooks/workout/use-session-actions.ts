
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

export const useSessionActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();

  const createWorkoutSession = async (exercises: string[] = ["Squats", "Développé couché", "Soulevé de terre"]) => {
    if (!user) {
      toast({
        title: t("common.error") || "Erreur",
        description: t("auth.signInRequired") || "Vous devez être connecté pour créer une séance d'entraînement",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsLoading(true);
      
      debugLogger.log("useSessionActions", "Création d'une nouvelle séance d'entraînement", {
        userId: user.id,
        exerciseCount: exercises.length
      });

      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([
          {
            user_id: user.id,
            exercises: exercises,
            status: 'in_progress',
            workout_type: 'strength',
            started_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        debugLogger.error("useSessionActions", "Erreur lors de la création de la séance:", error);
        throw error;
      }

      debugLogger.log("useSessionActions", "Session créée avec succès:", data);

      toast({
        title: t("workouts.sessionCreated") || "Séance créée",
        description: t("workouts.readyToStart") || "Votre séance est prête à commencer",
      });

      // Rediriger vers la nouvelle séance
      if (data?.id) {
        navigate(`/workouts/session/${data.id}`);
        return data;
      }
      
      return null;
    } catch (error) {
      debugLogger.error("useSessionActions", "Erreur lors de la création de la séance:", error);
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.sessionCreateFailed") || "Impossible de créer la séance d'entraînement",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmEndWorkout = async (difficulty: string, duration: number, muscleGroups: string[]) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      debugLogger.log("useSessionActions", "Finalisation de la séance d'entraînement", {
        difficulty,
        duration,
        muscleGroups
      });
      
      // Insérer les statistiques d'entraînement
      const { error } = await supabase
        .from('training_stats')
        .insert({
          user_id: user.id,
          perceived_difficulty: difficulty,
          session_duration_minutes: duration,
          muscle_groups_worked: muscleGroups,
          created_at: new Date().toISOString()
        });

      if (error) {
        debugLogger.error("useSessionActions", "Erreur lors de l'insertion des stats:", error);
        throw error;
      }
      
      toast({
        title: t("workouts.sessionCompleted") || "Séance terminée",
        description: t("workouts.statsRecorded") || "Vos statistiques ont été enregistrées",
      });
      
      navigate('/workouts');
      return true;
    } catch (error) {
      debugLogger.error("useSessionActions", "Erreur lors de la finalisation de la séance:", error);
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.finalizationFailed") || "Impossible de finaliser votre séance",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createWorkoutSession,
    handleConfirmEndWorkout,
    isLoading,
  };
};
