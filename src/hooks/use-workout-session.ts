
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useActiveSession } from "./workout/use-active-session";
import { useSessionTimer } from "./workout/use-session-timer";
import { useWorkoutOperations } from "./workout/use-workout-operations";

export const useWorkoutSession = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  
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
    }
    
    return () => {
      stopTimer();
    };
  }, [activeSession]);

  const finishWorkout = async (additionalData: {
    perceived_difficulty?: 'easy' | 'moderate' | 'hard';
    calories_burned?: number;
  } = {}) => {
    if (!activeSession) return null;
    
    stopTimer();
    
    try {
      const durationMinutes = Math.floor(sessionTime / 60);
      
      // Update the session to mark it as completed
      const data = await updateWorkoutSession(activeSession.id, {
        status: 'completed',
        total_duration_minutes: durationMinutes,
        perceived_difficulty: additionalData.perceived_difficulty || 'moderate',
        calories_burned: additionalData.calories_burned || Math.round(durationMinutes * 8), // Simple estimation
        completed_at: new Date().toISOString()
      });

      if (data) {
        setActiveSession(null);
        
        toast({
          title: t("workouts.completeWorkout"),
          description: `${t("workouts.totalDuration")}: ${durationMinutes} ${t("workouts.minutes")}`,
        });
        
        // Redirect to the summary page
        navigate(`/workouts/summary/${data.id}`);
        
        return data;
      }
      return null;
    } catch (error) {
      console.error(t("workouts.errors.sessionFinalize"), error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.sessionFinalizeDescription"),
        variant: "destructive",
      });
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
