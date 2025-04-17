
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useActiveSession } from "./workout/use-active-session";
import { useSessionTimer } from "./workout/use-session-timer";
import { useWorkoutOperations } from "./workout/use-workout-operations";
import { useNotificationManager } from "@/hooks/use-notification-manager";

export const useWorkoutSession = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { notify } = useNotificationManager();
  
  // Use the specialized hooks
  const { isLoading: isSessionLoading, activeSession, setActiveSession, checkActiveSession } = useActiveSession();
  const { sessionTime, formatTime, startTimer, stopTimer } = useSessionTimer();
  const { isLoading: isOperationLoading, startWorkout, updateWorkoutSession } = useWorkoutOperations();

  // Combine loading states
  const isLoading = isSessionLoading || isOperationLoading;

  // Start timer when an active session is found
  useEffect(() => {
    if (activeSession) {
      // Calculate the elapsed time since the session started
      const startTime = new Date(activeSession.created_at).getTime();
      const currentTime = new Date().getTime();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      
      // Start the timer with the calculated elapsed time
      startTimer();
      
      console.log("Session active trouvée:", activeSession);
    }
    
    return () => {
      stopTimer();
    };
  }, [activeSession]);

  const finishWorkout = async (additionalData: {
    perceived_difficulty?: 'easy' | 'moderate' | 'hard';
    calories_burned?: number;
  } = {}) => {
    if (!activeSession) {
      console.log("Aucune session active trouvée lors de la tentative de terminer l'entraînement");
      notify(
        t("common.error") || "Erreur",
        t("workouts.noActiveSession") || "Aucune session active trouvée",
        "error"
      );
      return null;
    }
    
    stopTimer();
    
    try {
      const durationMinutes = Math.floor(sessionTime / 60);
      
      console.log("Finalisation de la session d'entraînement:", {
        sessionId: activeSession.id,
        duration: durationMinutes,
        additionalData
      });
      
      // Mise à jour des champs de la session
      const data = await updateWorkoutSession(activeSession.id, {
        status: 'completed',
        total_duration_minutes: durationMinutes,
        perceived_difficulty: additionalData.perceived_difficulty || 'moderate',
        calories_burned: additionalData.calories_burned || Math.round(durationMinutes * 8)
      });

      if (data) {
        setActiveSession(null);
        
        notify(
          t("workouts.completeWorkout") || "Entraînement terminé",
          `${t("workouts.totalDuration") || "Durée totale"}: ${durationMinutes} ${t("workouts.minutes") || "minutes"}`,
          "success"
        );
        
        // Redirect to the summary page
        navigate(`/workouts/summary/${data.id}`);
        
        return data;
      }
      
      console.log("Aucune donnée retournée après la mise à jour de la session");
      notify(
        t("common.error") || "Erreur",
        t("workouts.errors.sessionFinalizeDescription") || "Impossible de finaliser la session",
        "error"
      );
      return null;
    } catch (error) {
      console.error(t("workouts.errors.sessionFinalize") || "Erreur lors de la finalisation de la session", error);
      notify(
        t("common.error") || "Erreur",
        t("workouts.errors.sessionFinalizeDescription") || "Impossible de finaliser la session",
        "error"
      );
      return null;
    }
  };

  return {
    isLoading,
    activeSession,
    sessionTime,
    formatTime,
    startWorkout,
    finishWorkout
  };
};
