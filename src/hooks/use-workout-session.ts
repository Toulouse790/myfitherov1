
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useActiveSession } from "./workout/use-active-session";
import { useSessionTimer } from "./workout/use-session-timer";
import { useWorkoutOperations } from "./workout/use-workout-operations";
import { useNotificationManager } from "@/hooks/use-notification-manager";
import { debugLogger } from "@/utils/debug-logger";
import { supabase } from "@/integrations/supabase/client";

export const useWorkoutSession = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { notify } = useNotificationManager();
  
  // Use the specialized hooks
  const { isLoading: isSessionLoading, activeSession, setActiveSession, checkActiveSession } = useActiveSession();
  const { sessionTime, formatTime, startTimer, stopTimer } = useSessionTimer();
  const { isLoading: isOperationLoading, error: operationError, startWorkout, updateWorkoutSession } = useWorkoutOperations();

  // État pour suivre le processus de finalisation
  const [isFinishing, setIsFinishing] = useState(false);
  const [totalWeight, setTotalWeight] = useState(0);

  // Combine loading states
  const isLoading = isSessionLoading || isOperationLoading;

  // Start timer when an active session is found
  useEffect(() => {
    if (activeSession) {
      // Calculate the elapsed time since the session started
      try {
        const startTime = new Date(activeSession.created_at).getTime();
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        
        // Validation pour éviter des temps aberrants
        if (elapsedSeconds < 0 || elapsedSeconds > 86400) { // Plus de 24h = probablement une erreur
          debugLogger.warn("useWorkoutSession", "Temps écoulé anormal détecté, réinitialisation à 0", { 
            elapsedSeconds, 
            created_at: activeSession.created_at 
          });
          startTimer(0);
        } else {
          startTimer(elapsedSeconds);
        }
        
        debugLogger.log("useWorkoutSession", "Session active trouvée:", activeSession);
        
        // Récupérer le poids total soulevé pour cette session
        fetchTotalWeight(activeSession.id);
      } catch (error) {
        debugLogger.error("useWorkoutSession", "Erreur lors du calcul du temps écoulé:", error);
        startTimer(0);
      }
    }
    
    return () => {
      stopTimer();
    };
  }, [activeSession, startTimer, stopTimer]);

  // Récupération du poids total soulevé pour la session
  const fetchTotalWeight = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('exercise_sets')
        .select('weight, reps')
        .eq('session_id', sessionId);
        
      if (error) {
        debugLogger.error("useWorkoutSession", "Erreur lors de la récupération des séries d'exercices:", error);
        return;
      }
      
      if (data && data.length > 0) {
        // Calculer le poids total soulevé
        const total = data.reduce((sum, set) => {
          const weight = set.weight || 0;
          const reps = set.reps || 0;
          return sum + (weight * reps);
        }, 0);
        
        setTotalWeight(total);
        debugLogger.log("useWorkoutSession", "Poids total calculé:", total);
      }
    } catch (error) {
      debugLogger.error("useWorkoutSession", "Exception lors du calcul du poids total:", error);
    }
  };

  // Gérer les erreurs opérationnelles
  useEffect(() => {
    if (operationError) {
      debugLogger.error("useWorkoutSession", "Erreur d'opération:", operationError);
      notify(
        t("common.error") || "Erreur",
        t("workouts.errors.sessionFinalizeDescription") || "Impossible de finaliser la session",
        "error"
      );
    }
  }, [operationError, notify, t]);

  const finishWorkout = async (additionalData: {
    perceived_difficulty?: 'easy' | 'moderate' | 'hard';
    calories_burned?: number;
  } = {}) => {
    if (!activeSession) {
      debugLogger.log("useWorkoutSession", "Aucune session active trouvée lors de la tentative de terminer l'entraînement");
      notify(
        t("common.error") || "Erreur",
        t("workouts.noActiveSession") || "Aucune session active trouvée",
        "error"
      );
      return null;
    }
    
    if (!user) {
      debugLogger.log("useWorkoutSession", "Utilisateur non authentifié lors de la finalisation");
      notify(
        t("common.error") || "Erreur",
        t("auth.signInRequired") || "Vous devez être connecté pour finaliser une session",
        "error"
      );
      return null;
    }
    
    try {
      setIsFinishing(true);
      stopTimer();
      
      // Validation de la durée - prévention des valeurs aberrantes
      let durationMinutes = 0;
      if (sessionTime > 0 && sessionTime < 86400) { // Moins de 24h
        durationMinutes = Math.floor(sessionTime / 60);
      } else {
        // Si la durée est anormale, estimer à partir de created_at
        try {
          const startTime = new Date(activeSession.created_at).getTime();
          const currentTime = new Date().getTime();
          const elapsed = Math.floor((currentTime - startTime) / 1000);
          if (elapsed > 0 && elapsed < 86400) {
            durationMinutes = Math.floor(elapsed / 60);
          } else {
            // Fallback à une valeur raisonnable si tout échoue
            durationMinutes = 30;
          }
        } catch (error) {
          durationMinutes = 30; // Valeur par défaut
          debugLogger.error("useWorkoutSession", "Erreur lors du calcul alternatif de la durée:", error);
        }
      }
      
      const caloriesBurned = additionalData.calories_burned || Math.round(durationMinutes * 8);
      const difficulty = additionalData.perceived_difficulty || 'moderate';
      
      debugLogger.log("useWorkoutSession", "Finalisation de la session d'entraînement:", {
        sessionId: activeSession.id,
        duration: durationMinutes,
        difficulty,
        calories: caloriesBurned,
        totalWeight
      });
      
      // Mise à jour des champs de la session
      const updateData = {
        status: 'completed',
        total_duration_minutes: durationMinutes,
        perceived_difficulty: difficulty,
        calories_burned: caloriesBurned,
        total_weight_lifted: totalWeight,
        updated_at: new Date().toISOString()
      };
      
      debugLogger.log("useWorkoutSession", "Données de mise à jour:", updateData);
      
      // Vérifier si la session existe toujours
      const { data: sessionCheck, error: checkError } = await supabase
        .from('workout_sessions')
        .select('id')
        .eq('id', activeSession.id)
        .maybeSingle();
        
      if (checkError) {
        debugLogger.error("useWorkoutSession", "Erreur lors de la vérification de la session:", checkError);
        throw new Error("Erreur de vérification de la session");
      }
      
      if (!sessionCheck) {
        debugLogger.error("useWorkoutSession", "La session n'existe plus dans la base de données");
        throw new Error("La session n'existe plus");
      }
      
      // Mise à jour de la session avec les statistiques complètes
      const sessionData = await updateWorkoutSession(activeSession.id, updateData);

      if (!sessionData) {
        throw new Error("La mise à jour de la session a échoué");
      }
      
      // Mise à jour ou création des statistiques d'entraînement
      try {
        // Vérifier si des statistiques existent déjà
        const { data: existingStats, error: statsCheckError } = await supabase
          .from('training_stats')
          .select('id')
          .eq('session_id', activeSession.id)
          .maybeSingle();
        
        if (statsCheckError && statsCheckError.code !== 'PGRST116') {
          debugLogger.error("useWorkoutSession", "Erreur lors de la vérification des statistiques:", statsCheckError);
        }
        
        const statsData = {
          user_id: user.id,
          session_id: activeSession.id,
          session_duration_minutes: durationMinutes,
          calories_burned: caloriesBurned,
          perceived_difficulty: difficulty,
          total_weight_lifted: totalWeight,
          muscle_groups_worked: activeSession.exercises || [],
          rest_time_seconds: 90 // Valeur par défaut
        };
        
        if (existingStats) {
          // Mettre à jour les statistiques existantes
          const { error: updateStatsError } = await supabase
            .from('training_stats')
            .update(statsData)
            .eq('id', existingStats.id);
            
          if (updateStatsError) {
            debugLogger.error("useWorkoutSession", "Erreur lors de la mise à jour des statistiques:", updateStatsError);
          }
        } else {
          // Créer une nouvelle entrée de statistiques
          const { error: insertStatsError } = await supabase
            .from('training_stats')
            .insert([statsData]);
            
          if (insertStatsError) {
            debugLogger.error("useWorkoutSession", "Erreur lors de l'insertion des statistiques:", insertStatsError);
          }
        }
      } catch (statsError) {
        debugLogger.error("useWorkoutSession", "Erreur lors de la gestion des statistiques:", statsError);
        // Ne pas bloquer le flux principal si les statistiques échouent
      }
      
      // Mettre à null après une réponse réussie de Supabase
      setActiveSession(null);
      
      toast({
        title: t("workouts.completeWorkout") || "Entraînement terminé",
        description: `${t("workouts.totalDuration") || "Durée totale"}: ${durationMinutes} ${t("workouts.minutes") || "minutes"}`,
        variant: "success"
      });
      
      // Redirect to the summary page
      navigate(`/workouts/summary/${activeSession.id}`);
      
      return sessionData;
    } catch (error) {
      debugLogger.error("useWorkoutSession", "Erreur lors de la finalisation de la session", error);
      notify(
        t("common.error") || "Erreur",
        t("workouts.errors.sessionFinalizeDescription") || "Impossible de finaliser la session",
        "error"
      );
      return null;
    } finally {
      setIsFinishing(false);
    }
  };

  return {
    isLoading,
    isFinishing,
    activeSession,
    sessionTime,
    formatTime,
    startWorkout,
    finishWorkout,
    totalWeight
  };
};
