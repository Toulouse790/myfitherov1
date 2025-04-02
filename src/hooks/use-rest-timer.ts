
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseRestTimerOptions {
  initialDuration?: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export const useRestTimer = ({
  initialDuration = 90,
  onComplete,
  autoStart = false
}: UseRestTimerOptions = {}) => {
  const [duration, setDuration] = useState<number | null>(autoStart ? initialDuration : null);
  const [isActive, setIsActive] = useState(autoStart);
  const { toast } = useToast();
  const { t } = useLanguage();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback((customDuration?: number) => {
    clearTimerInterval();
    setDuration(customDuration ?? initialDuration);
    setIsActive(true);
  }, [clearTimerInterval, initialDuration]);

  const pauseTimer = useCallback(() => {
    clearTimerInterval();
    setIsActive(false);
  }, [clearTimerInterval]);

  const resetTimer = useCallback(() => {
    clearTimerInterval();
    setDuration(initialDuration);
    setIsActive(false);
  }, [clearTimerInterval, initialDuration]);

  const skipTimer = useCallback(() => {
    clearTimerInterval();
    setDuration(null);
    setIsActive(false);
    
    if (onComplete) {
      onComplete();
    }
    
    toast({
      title: t("workouts.restFinished") || "Rest skipped",
      description: t("workouts.readyForNextSet") || "Ready for next set",
    });
  }, [clearTimerInterval, onComplete, toast, t]);

  const adjustTimer = useCallback((adjustment: number) => {
    setDuration(prev => {
      if (prev === null) return null;
      return Math.max(1, prev + adjustment);
    });
  }, []);

  // Effect to handle the timer countdown
  useEffect(() => {
    if (isActive && duration !== null) {
      intervalRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev === null || prev <= 1) {
            clearTimerInterval();
            setIsActive(false);
            
            if (onComplete) {
              onComplete();
            }
            
            toast({
              title: t("workouts.restFinished") || "Rest complete",
              description: t("workouts.readyForNextSet") || "Ready for next set",
            });
            
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearTimerInterval();
  }, [isActive, duration, clearTimerInterval, onComplete, toast, t]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimerInterval();
  }, [clearTimerInterval]);

  return {
    duration,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    adjustTimer
  };
};
