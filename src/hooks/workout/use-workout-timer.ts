import { useState, useEffect } from "react";

export const useWorkoutTimer = () => {
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return {
    duration,
    isRunning,
    setIsRunning
  };
};