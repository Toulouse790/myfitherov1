
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
      
      // Mise à jour des champs sans utiliser 'completed_at' qui manque dans la table
      const data = await updateWorkoutSession(activeSession.id, {
        status: 'completed',
        total_duration_minutes: durationMinutes,
        perceived_difficulty: additionalData.perceived_difficulty || 'moderate',
        calories_burned: additionalData.calories_burned || Math.round(durationMinutes * 8) // Simple estimation
      });

      if (data) {
        setActiveSession(null);
        
        notify(
          t("workouts.completeWorkout"),
          `${t("workouts.totalDuration")}: ${durationMinutes} ${t("workouts.minutes")}`,
          "success"
        );
        
        // Redirect to the summary page
        navigate(`/workouts/summary/${data.id}`);
        
        return data;
      }
      
      console.log("Aucune donnée retournée après la mise à jour de la session");
      return null;
    } catch (error) {
      console.error(t("workouts.errors.sessionFinalize"), error);
      notify(
        t("common.error"),
        t("workouts.errors.sessionFinalizeDescription"),
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
