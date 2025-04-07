
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
      return;
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
            started_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      debugLogger.log("useSessionActions", "Session créée avec succès:", data);

      toast({
        title: t("workouts.sessionCreated") || "Séance créée",
        description: t("workouts.readyToStart") || "Votre séance est prête à commencer",
      });

      // Rediriger vers la nouvelle séance
      if (data?.id) {
        navigate(`/workout/${data.id}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la séance:", error);
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.sessionCreateFailed") || "Impossible de créer la séance d'entraînement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createWorkoutSession,
    isLoading,
  };
};
