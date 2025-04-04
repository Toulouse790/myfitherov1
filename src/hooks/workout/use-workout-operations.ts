
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { WorkoutSession, WorkoutSessionUpdate } from "@/types/workout-session";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

export const useWorkoutOperations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const startWorkout = async (programId?: string, exercises?: string[]) => {
    if (!user) {
      toast({
        title: t("auth.error") || "Erreur d'authentification",
        description: t("auth.sessionExpired") || "Session expirée, veuillez vous reconnecter",
        variant: "destructive",
      });
      navigate('/sign-in');
      return null;
    }

    try {
      setIsLoading(true);
      debugLogger.log("useWorkoutOperations", "Démarrage de l'entraînement avec exercices:", exercises || []);
      
      // Créer une session d'entraînement avec les champs corrects
      const sessionData = {
        user_id: user.id,
        exercises: exercises || [],
        status: 'in_progress',
        workout_type: 'strength',
        target_duration_minutes: 45
      };
      
      debugLogger.log("useWorkoutOperations", "Données de session à insérer:", sessionData);
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) {
        console.error("Erreur création session:", error);
        throw error;
      }
      
      debugLogger.log("useWorkoutOperations", "Session créée avec succès:", data);
      
      // S'assurer que le chemin est correct et commence par un slash
      const redirectPath = `/workouts/session/${data.id}`;
      debugLogger.log("useWorkoutOperations", "Session créée, redirection vers:", redirectPath);
      
      if (data) {
        // Utiliser setTimeout pour assurer que la navigation se produit après le rendu
        setTimeout(() => {
          navigate(redirectPath);
        }, 100);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error(t("workouts.errors.sessionCreate") || "Erreur lors de la création de la session", error);
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.errors.sessionCreateDescription") || "Impossible de créer une session d'entraînement",
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
      console.error(t("workouts.errors.sessionUpdate") || "Erreur lors de la mise à jour de la session", error);
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.errors.sessionUpdateDescription") || "Impossible de mettre à jour la session",
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
