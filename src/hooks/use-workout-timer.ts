import { useState, useEffect } from 'react';

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

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setDuration(0);
    setIsRunning(false);
    setIsPaused(false);
  };

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