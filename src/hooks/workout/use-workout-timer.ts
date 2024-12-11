import { useState, useEffect } from "react";

export const useWorkoutTimer = (initialIsRunning: boolean = false) => {
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(initialIsRunning);

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

  return {
    duration,
    isRunning,
    setIsRunning
  };
};