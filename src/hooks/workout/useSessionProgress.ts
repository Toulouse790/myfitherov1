
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";

export const useSessionProgress = (sessionId?: string) => {
  const { toast } = useToast();
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, any>>({});
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);

  const handleExerciseSelect = (index: number) => {
    setCurrentExerciseIndex(index);
    setShowExerciseDetail(true);
  };

  const handleExerciseComplete = useCallback(async (exerciseName: string) => {
    try {
      if (!sessionId) return;
      
      const updatedProgress = {
        ...exerciseProgress,
        [exerciseName]: {
          ...exerciseProgress[exerciseName],
          completed: true
        }
      };
      
      setExerciseProgress(updatedProgress);
      
      await supabase
        .from('workout_sessions')
        .update({ exercise_progress: updatedProgress })
        .eq('id', sessionId);
      
      setShowExerciseDetail(false);
      
      toast({
        title: "Exercice terminé !",
        description: "Bien joué ! Passez à l'exercice suivant.",
      });
      
    } catch (error) {
      debugLogger.error("useSessionProgress", "Erreur lors de la mise à jour de la progression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la progression",
        variant: "destructive",
      });
    }
  }, [sessionId, exerciseProgress, toast]);

  return {
    exerciseProgress,
    setExerciseProgress,
    currentExerciseIndex,
    showExerciseDetail,
    setShowExerciseDetail,
    handleExerciseSelect,
    handleExerciseComplete,
  };
};
