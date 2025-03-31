
import { useState, useRef, useCallback } from "react";

export const useSessionTimer = () => {
  const [sessionTime, setSessionTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback((initialSeconds = 0) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setSessionTime(initialSeconds);
    
    timerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setSessionTime(0);
  }, [stopTimer]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    sessionTime,
    formatTime,
    startTimer,
    stopTimer,
    resetTimer
  };
};
