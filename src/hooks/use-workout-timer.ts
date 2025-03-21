
import { useState, useEffect } from "react";

export const useWorkoutTimer = () => {
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [restTime, setRestTime] = useState(90); // Temps de repos par défaut à 90 secondes

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setDuration(0);
  };

  const adjustRestTime = (adjustment: number) => {
    // Limiter le temps de repos entre 15 et 180 secondes
    setRestTime(prev => Math.max(15, Math.min(180, prev + adjustment)));
  };

  return {
    duration,
    isRunning,
    restTime,
    startTimer,
    stopTimer,
    resetTimer,
    adjustRestTime
  };
};
