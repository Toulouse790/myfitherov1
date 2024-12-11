import { useState, useEffect } from "react";

export const useWorkoutTimer = (isRunning: boolean) => {
  const [duration, setDuration] = useState(0);

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
    isRunning
  };
};