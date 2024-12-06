import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useRestTimer = (initialRestTime: number = 90) => {
  const [restTimers, setRestTimers] = useState<{ [key: string]: number | null }>({});
  const { toast } = useToast();

  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    Object.entries(restTimers).forEach(([exerciseId, timer]) => {
      if (timer !== null && timer > 0) {
        intervals[exerciseId] = setInterval(() => {
          setRestTimers(prev => {
            const currentTimer = prev[exerciseId];
            if (currentTimer === null || currentTimer <= 1) {
              clearInterval(intervals[exerciseId]);
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
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [restTimers, toast]);

  const startRestTimer = (exerciseId: string) => {
    setRestTimers(prev => ({
      ...prev,
      [exerciseId]: initialRestTime
    }));
  };

  return {
    restTimers,
    startRestTimer
  };
};