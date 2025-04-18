
import { useState, useEffect } from "react";

export const useSessionTimer = () => {
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionStartTime) return;

    const timer = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
      setSessionDuration(elapsedSeconds);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    sessionDuration,
    sessionStartTime,
    setSessionStartTime,
    formatDuration,
  };
};
