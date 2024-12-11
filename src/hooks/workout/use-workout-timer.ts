import { useState, useEffect, useCallback } from "react";

export const useWorkoutTimer = () => {
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      console.log("Timer started - initial duration:", duration);
      interval = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          console.log("Timer tick - new duration:", newDuration);
          return newDuration;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        console.log("Cleaning up timer interval");
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const startTimer = useCallback(() => {
    console.log("Starting timer");
    setIsRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    console.log("Stopping timer");
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    console.log("Resetting timer");
    setIsRunning(false);
    setDuration(0);
  }, []);

  return {
    duration,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer
  };
};