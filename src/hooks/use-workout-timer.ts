import { useState, useEffect, useCallback } from 'react';

export const useWorkoutTimer = () => {
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isPaused) {
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
  }, [isRunning, isPaused]);

  const startTimer = useCallback(() => {
    console.log("Starting timer");
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const stopTimer = useCallback(() => {
    console.log("Stopping timer");
    setIsRunning(false);
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
    stopTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setIsRunning
  };
};