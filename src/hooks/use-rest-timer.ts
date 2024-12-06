import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useRestTimer = (initialRestTime: number = 90) => {
  const [restTimers, setRestTimers] = useState<{ [key: string]: number | null }>({});
  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime); // A4 note
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime); // Lower volume
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.2); // Short beep
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, []);

  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    Object.entries(restTimers).forEach(([exerciseId, timer]) => {
      if (timer !== null && timer > 0) {
        console.log(`Rest timer for ${exerciseId}: ${timer}s`);
        intervals[exerciseId] = setInterval(() => {
          setRestTimers(prev => {
            const currentTimer = prev[exerciseId];
            if (currentTimer === null || currentTimer <= 1) {
              playSound();
              toast({
                title: "Repos terminé !",
                description: "C'est reparti ! Commencez la série suivante.",
              });
              return { ...prev, [exerciseId]: null };
            }
            return { ...prev, [exerciseId]: currentTimer - 1 };
          });
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, [restTimers, toast, playSound]);

  const startRestTimer = useCallback((exerciseId: string) => {
    console.log(`Starting rest timer for ${exerciseId}`);
    setRestTimers(prev => ({
      ...prev,
      [exerciseId]: initialRestTime
    }));
  }, [initialRestTime]);

  const cancelRestTimer = useCallback((exerciseId: string) => {
    console.log(`Canceling rest timer for ${exerciseId}`);
    setRestTimers(prev => ({
      ...prev,
      [exerciseId]: null
    }));
  }, []);

  return {
    restTimers,
    startRestTimer,
    cancelRestTimer
  };
};