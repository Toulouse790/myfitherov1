
import { useState, useRef, useCallback } from "react";
import { debugLogger } from "@/utils/debug-logger";

export const useSessionTimer = () => {
  const [sessionTime, setSessionTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startTimer = useCallback((initialSeconds = 0) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    debugLogger.log("SessionTimer", "Démarrage du timer avec", { initialSeconds });
    setSessionTime(initialSeconds);
    startTimeRef.current = Date.now() - (initialSeconds * 1000);
    
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setSessionTime(elapsed);
      }
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    debugLogger.log("SessionTimer", "Arrêt du timer");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = null;
  }, []);

  const resetTimer = useCallback(() => {
    debugLogger.log("SessionTimer", "Réinitialisation du timer");
    stopTimer();
    setSessionTime(0);
    startTimeRef.current = null;
  }, [stopTimer]);

  const formatTime = useCallback((seconds: number) => {
    if (seconds > 86400) { // Plus de 24 heures (improbable pour une séance)
      debugLogger.warn("SessionTimer", "Durée anormalement longue détectée", { seconds });
      seconds = seconds % 86400; // Limite à 24h max
    }
    
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
