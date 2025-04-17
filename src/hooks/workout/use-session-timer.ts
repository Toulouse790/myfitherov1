
import { useState, useRef, useCallback, useEffect } from "react";
import { debugLogger } from "@/utils/debug-logger";

export const useSessionTimer = () => {
  const [sessionTime, setSessionTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  const startTimer = useCallback((initialSeconds = 0) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    debugLogger.log("SessionTimer", "Démarrage du timer avec", { initialSeconds });
    
    // Validation de la valeur initiale
    const validInitialSeconds = initialSeconds >= 0 && initialSeconds < 86400 
      ? initialSeconds 
      : 0;
      
    setSessionTime(validInitialSeconds);
    
    // Enregistrement précis du temps de départ
    startTimeRef.current = Date.now() - (validInitialSeconds * 1000);
    lastTickRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const now = Date.now();
        // Vérifier que le temps augmente normalement (protection contre les sauts d'horloge)
        const timeSinceLastTick = now - lastTickRef.current;
        
        if (timeSinceLastTick > 0 && timeSinceLastTick < 10000) { // max 10s entre les ticks
          const elapsed = Math.floor((now - startTimeRef.current) / 1000);
          
          // Validation pour éviter des temps aberrants
          if (elapsed >= 0 && elapsed < 86400) { // max 24h
            setSessionTime(elapsed);
          }
        } else {
          // Réinitialiser le temps de référence si on détecte un saut
          debugLogger.warn("SessionTimer", "Saut d'horloge détecté, réinitialisation de la référence", {
            timeSinceLastTick
          });
          startTimeRef.current = now - (sessionTime * 1000);
        }
        
        lastTickRef.current = now;
      }
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    debugLogger.log("SessionTimer", "Arrêt du timer");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    debugLogger.log("SessionTimer", "Réinitialisation du timer");
    stopTimer();
    setSessionTime(0);
    startTimeRef.current = null;
  }, [stopTimer]);

  // Nettoyage automatique à la destruction du hook
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = useCallback((seconds: number) => {
    // Validation de la valeur en entrée
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
      debugLogger.warn("SessionTimer", "Valeur de temps invalide", { seconds });
      seconds = 0;
    }
    
    if (seconds > 86400) { // Plus de 24 heures
      debugLogger.warn("SessionTimer", "Durée anormalement longue détectée", { seconds });
      seconds = seconds % 86400; // Limite à 24h max
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    sessionTime,
    formatTime,
    startTimer,
    stopTimer,
    resetTimer
  };
};
