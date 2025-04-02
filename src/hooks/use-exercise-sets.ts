
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRestTimer } from "./use-rest-timer";

interface UseExerciseSetsOptions {
  initialSets?: number;
  initialWeight?: number;
  initialReps?: number;
  restDuration?: number;
  onAllSetsCompleted?: () => void;
}

export const useExerciseSets = ({
  initialSets = 3,
  initialWeight = 20,
  initialReps = 12,
  restDuration = 90,
  onAllSetsCompleted
}: UseExerciseSetsOptions = {}) => {
  const [totalSets, setTotalSets] = useState(initialSets);
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState(initialWeight);
  const [reps, setReps] = useState(initialReps);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const {
    duration: restTimer,
    startTimer: startRest,
    skipTimer: skipRest,
    adjustTimer: adjustRestTime
  } = useRestTimer({
    initialDuration: restDuration,
    onComplete: () => {
      if (currentSet >= totalSets && onAllSetsCompleted) {
        onAllSetsCompleted();
      }
    }
  });
  
  const handleSetComplete = useCallback(() => {
    if (restTimer !== null) return;
    
    // Mark the current set as completed
    setCompletedSets(prev => [...prev, currentSet]);
    
    if (currentSet < totalSets) {
      // Move to the next set
      setCurrentSet(prev => prev + 1);
      
      // Start the rest timer
      startRest();
      
      // Show notification
      toast({
        title: t("workouts.setCompleted"),
        description: `${t("workouts.rest")} ${restDuration} ${t("common.sec")} ${t("workouts.nextExercise")} ${currentSet + 1}`,
      });
    } else {
      // All sets completed
      toast({
        title: t("workouts.exerciseCompleted"),
        description: `${t("nutrition.completed")} ${totalSets} ${t("workouts.sets")}`,
      });
      
      // Start a slightly longer rest
      startRest(120);
      
      if (onAllSetsCompleted) {
        // Delay the callback to allow for the rest period
        setTimeout(onAllSetsCompleted, 500);
      }
    }
  }, [currentSet, totalSets, restTimer, toast, t, startRest, restDuration, onAllSetsCompleted]);
  
  const handleWeightChange = useCallback((newWeight: number) => {
    setWeight(newWeight);
  }, []);
  
  const handleRepsChange = useCallback((newReps: number) => {
    setReps(newReps);
  }, []);
  
  const handleSetsChange = useCallback((newSets: number) => {
    if (newSets >= completedSets.length) {
      setTotalSets(newSets);
    }
  }, [completedSets.length]);
  
  const resetSets = useCallback(() => {
    setCurrentSet(1);
    setCompletedSets([]);
    setTotalSets(initialSets);
    setWeight(initialWeight);
    setReps(initialReps);
  }, [initialSets, initialWeight, initialReps]);
  
  return {
    totalSets,
    currentSet,
    weight,
    reps,
    completedSets,
    restTimer,
    handleSetComplete,
    handleWeightChange,
    handleRepsChange,
    handleSetsChange,
    skipRest,
    adjustRestTime,
    resetSets,
    isRestActive: restTimer !== null,
    areAllSetsCompleted: completedSets.length === totalSets
  };
};
