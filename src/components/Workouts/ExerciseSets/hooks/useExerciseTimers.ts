import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseExerciseTimersProps {
  onExerciseComplete?: (index: number) => void;
  currentExerciseIndex?: number;
}

export const useExerciseTimers = ({ 
  onExerciseComplete, 
  currentExerciseIndex 
}: UseExerciseTimersProps) => {
  const [restTimers, setRestTimers] = useState<{ [key: string]: number | null }>({});
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [totalRestTime, setTotalRestTime] = useState<number>(0);
  const [isExerciseTransition, setIsExerciseTransition] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    Object.entries(restTimers).forEach(([exerciseId, timer]) => {
      if (timer !== null && timer > 0) {
        intervals[exerciseId] = setInterval(() => {
          setRestTimers(prev => {
            const currentTimer = prev[exerciseId];
            if (currentTimer === null || currentTimer <= 1) {
              clearInterval(intervals[exerciseId]);
              if (isExerciseTransition) {
                setIsExerciseTransition(false);
                if (onExerciseComplete && currentExerciseIndex !== undefined) {
                  onExerciseComplete(currentExerciseIndex);
                }
              } else {
                toast({
                  title: "Repos terminé !",
                  description: "C'est reparti ! Commencez la série suivante.",
                });
              }
              return { ...prev, [exerciseId]: null };
            }
            return { ...prev, [exerciseId]: currentTimer - 1 };
          });
          setTotalRestTime(prev => prev + 1);
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, [restTimers, toast, isExerciseTransition, onExerciseComplete, currentExerciseIndex]);

  return {
    restTimers,
    setRestTimers,
    sessionDuration,
    totalRestTime,
    isExerciseTransition,
    setIsExerciseTransition,
    setTotalRestTime
  };
};