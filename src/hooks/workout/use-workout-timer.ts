import { useState, useEffect } from "react";

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
    } else {
      console.log("Timer stopped at duration:", duration);
    }

    return () => {
      if (interval) {
        console.log("Clearing timer interval");
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const startTimer = () => {
    console.log("Starting timer");
    setIsRunning(true);
  };

  const stopTimer = () => {
    console.log("Stopping timer");
    setIsRunning(false);
  };

  const resetTimer = () => {
    console.log("Resetting timer");
    setIsRunning(false);
    setDuration(0);
  };

  return {
    duration,
    isRunning,
    setIsRunning,
    startTimer,
    stopTimer,
    resetTimer
  };
};