
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";

export const useSessionCompletion = (
  sessionId?: string,
  sessionDuration = 0,
  exerciseProgress: Record<string, any> = {}
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [workoutStats, setWorkoutStats] = useState({
    duration: 0,
    totalCalories: 0,
    completedExercises: 0,
  });

  const handleCompleteWorkout = useCallback(() => {
    const completedExercisesCount = Object.values(exerciseProgress).filter(ex => ex.completed).length;
    const estimatedCalories = Math.round(sessionDuration / 60 * 7);
    
    setWorkoutStats({
      duration: Math.round(sessionDuration / 60),
      totalCalories: estimatedCalories,
      completedExercises: completedExercisesCount
    });
    
    setShowSummaryDialog(true);
  }, [exerciseProgress, sessionDuration]);

  const handleFinishWorkout = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      await supabase
        .from('workout_sessions')
        .update({
          status: 'completed',
          total_duration_minutes: Math.round(sessionDuration / 60),
          exercise_progress: exerciseProgress,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);
      
      toast({
        title: "Entraînement terminé !",
        description: `Bravo ! Vous avez brûlé environ ${workoutStats.totalCalories} calories en ${workoutStats.duration} minutes.`,
      });
      
      navigate('/workouts');
    } catch (error) {
      debugLogger.error("useSessionCompletion", "Erreur lors de la finalisation de l'entraînement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser l'entraînement",
        variant: "destructive",
      });
    }
  }, [sessionId, sessionDuration, exerciseProgress, workoutStats, toast, navigate]);

  return {
    showSummaryDialog,
    setShowSummaryDialog,
    workoutStats,
    handleCompleteWorkout,
    handleFinishWorkout,
  };
};
