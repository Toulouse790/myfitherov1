import { useState, useEffect, useCallback } from 'react';

export const useWorkoutTimer = () => {
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, isPaused]);

  const startTimer = useCallback(() => {
    console.log("Starting timer");
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pauseTimer = useCallback(() => {
    console.log("Pausing timer");
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    console.log("Resuming timer");
    setIsPaused(false);
  }, []);

  const resetTimer = useCallback(() => {
    console.log("Resetting timer");
    setDuration(0);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  return {
    duration,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer
  };
};