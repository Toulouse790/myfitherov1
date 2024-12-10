import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WorkoutStats {
  totalWeight: number;
  totalReps: number;
  totalSets: number;
  caloriesBurned: number;
}

export const useWorkoutData = (sessionId: string | null) => {
  const [stats, setStats] = useState<WorkoutStats>({
    totalWeight: 0,
    totalReps: 0,
    totalSets: 0,
    caloriesBurned: 0,
  });
  const { toast } = useToast();

  // Calculate calories based on exercise intensity
  const calculateCalories = (weight: number, reps: number): number => {
    const MET = 5.0; // Metabolic Equivalent for moderate weight training
    const duration = (reps * 3) / 60; // Assuming 3 seconds per rep
    return Math.round((MET * 3.5 * 80 * duration) / 200); // 80kg default weight
  };

  // Update stats when a set is completed
  const updateStats = async (weight: number, reps: number) => {
    setStats(prev => {
      const newStats = {
        totalWeight: prev.totalWeight + (weight * reps),
        totalReps: prev.totalReps + reps,
        totalSets: prev.totalSets + 1,
        caloriesBurned: prev.caloriesBurned + calculateCalories(weight, reps),
      };

      // Store in localStorage for persistence
      localStorage.setItem(`workout_stats_${sessionId}`, JSON.stringify(newStats));
      
      return newStats;
    });

    if (sessionId) {
      try {
        await supabase
          .from('training_stats')
          .upsert({
            session_id: sessionId,
            total_weight: stats.totalWeight,
            total_reps: stats.totalReps,
            calories_burned: stats.caloriesBurned,
          });
      } catch (error) {
        console.error('Error saving workout stats:', error);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les statistiques",
          variant: "destructive",
        });
      }
    }
  };

  // Load saved stats from localStorage on mount
  useEffect(() => {
    if (sessionId) {
      const savedStats = localStorage.getItem(`workout_stats_${sessionId}`);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    }
  }, [sessionId]);

  return {
    stats,
    updateStats,
  };
};