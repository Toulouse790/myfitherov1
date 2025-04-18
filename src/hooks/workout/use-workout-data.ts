import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

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
  const { user } = useAuth();
  const { t } = useLanguage();

  const calculateCalories = (weight: number, reps: number): number => {
    const MET = 5.0;
    const duration = (reps * 3) / 60;
    return Math.round((MET * 3.5 * 80 * duration) / 200);
  };

  const updateStats = async (weight: number, reps: number, exerciseName: string) => {
    if (!user) {
      debugLogger.error('useWorkoutData', 'No user found when trying to update stats');
      return;
    }

    setStats(prev => {
      const newStats = {
        totalWeight: prev.totalWeight + (weight * reps),
        totalReps: prev.totalReps + reps,
        totalSets: prev.totalSets + 1,
        caloriesBurned: prev.caloriesBurned + calculateCalories(weight, reps),
      };

      localStorage.setItem(`workout_stats_${sessionId}`, JSON.stringify(newStats));
      return newStats;
    });

    if (sessionId && user) {
      try {
        const duration = Math.floor(stats.totalSets * 3 / 60);
        const { data: statsData, error: statsError } = await supabase
          .from('training_stats')
          .insert({
            user_id: user.id,
            session_id: sessionId,
            session_duration_minutes: duration,
            muscle_groups_worked: ['biceps'],
            energy_level: 8,
            perceived_difficulty: 'easy',
          })
          .select()
          .single();

        if (statsError) {
          debugLogger.error('useWorkoutData', 'Error inserting training stats:', statsError);
          throw statsError;
        }

        if (!statsData) {
          throw new Error(t("workouts.errors.statsInsertFailed"));
        }

        const { data: weightData, error: weightError } = await supabase
          .from('user_exercise_weights')
          .upsert({
            user_id: user.id,
            exercise_name: exerciseName,
            weight: weight,
            last_used_weight: weight,
            last_used_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,exercise_name'
          })
          .select()
          .single();

        if (weightError) {
          debugLogger.error('useWorkoutData', 'Error updating exercise weight:', weightError);
          throw weightError;
        }

        if (!weightData) {
          throw new Error(t("workouts.errors.weightUpdateFailed"));
        }

      } catch (error) {
        debugLogger.error('useWorkoutData', 'Error saving workout stats:', error);
        toast({
          title: t("common.error"),
          description: t("workouts.errors.statsSaveFailed"),
          variant: "destructive",
        });
      }
    }
  };

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
