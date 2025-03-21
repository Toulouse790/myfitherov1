
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SleepStats } from "./use-sleep-tracking";

export const useSleepStats = () => {
  const { user } = useAuth();
  
  // Récupérer les statistiques de sommeil
  const { 
    data: sleepStats,
    isLoading: statsLoading 
  } = useQuery({
    queryKey: ['sleep-stats'],
    queryFn: async () => {
      if (!user) return null;
      
      // Récupérer les sessions de sommeil des 7 derniers jours
      const { data: sleepSessions, error } = await supabase
        .from('sleep_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('start_time', { ascending: false });
        
      if (error) throw error;
      
      if (!sleepSessions || sleepSessions.length === 0) {
        return null;
      }
      
      // Calculer les statistiques
      const avgDuration = sleepSessions.reduce((sum, session) => 
        sum + session.total_duration_minutes, 0) / sleepSessions.length;
        
      const avgScore = sleepSessions.reduce((sum, session) => 
        sum + (session.sleep_score || 0), 0) / sleepSessions.length;
      
      // Calcul de la dette de sommeil (basé sur un besoin de 8h par nuit)
      const sleepDebt = sleepSessions.reduce(
        (debt, session) => debt + Math.max(0, 480 - session.total_duration_minutes), 
        0
      );
      
      // Calculer la tendance: comparer moyenne des 3 derniers jours vs 4 jours précédents
      const recent = sleepSessions.slice(0, 3);
      const previous = sleepSessions.slice(3);
      
      const recentAvg = recent.length > 0 
        ? recent.reduce((sum, s) => sum + (s.sleep_score || 0), 0) / recent.length 
        : 0;
        
      const previousAvg = previous.length > 0 
        ? previous.reduce((sum, s) => sum + (s.sleep_score || 0), 0) / previous.length 
        : 0;
        
      const trend = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;
      
      // Régularité du sommeil
      const bedTimes = sleepSessions.map(s => 
        new Date(s.start_time).getHours() * 60 + new Date(s.start_time).getMinutes());
        
      const wakeTimes = sleepSessions.map(s => 
        new Date(s.end_time).getHours() * 60 + new Date(s.end_time).getMinutes());
      
      const bedTimeVariance = calculateVariance(bedTimes);
      const wakeTimeVariance = calculateVariance(wakeTimes);
      
      // Plus la variance est basse, plus la consistance est élevée
      const consistencyScore = 100 - Math.min(100, (bedTimeVariance + wakeTimeVariance) / 60);
      
      return {
        average_duration: avgDuration,
        average_score: avgScore,
        sleep_debt_minutes: sleepDebt,
        weekly_trend: trend,
        consistency_score: consistencyScore
      } as SleepStats;
    },
    enabled: !!user
  });

  // Fonction pour calculer la durée de sommeil recommandée
  const calculateRecommendedSleep = useCallback((
    activityLevel: string | null,
    trainingFrequency: string | null,
    workoutDuration: string | null,
    trainingStats: any[] = []
  ): { hours: number, minutes: number } => {
    // Base sleep time in minutes (7 hours = 420 minutes)
    let baseMinutes = 420;

    // Adjust based on activity level
    const activityMultiplier = {
      'sedentary': 0,
      'lightly_active': 15,
      'moderately_active': 30,
      'very_active': 45,
      'extra_active': 60
    }[activityLevel || 'moderately_active'] || 30;

    // Adjust based on training frequency
    const frequencyMultiplier = {
      '1-2': 10,
      '3-4': 20,
      '5+': 30
    }[trainingFrequency || '3-4'] || 20;

    // Calculate average daily calorie burn from recent workouts
    const avgCaloriesBurned = trainingStats?.length
      ? trainingStats.reduce((acc, stat) => acc + (stat.calories_burned || 0), 0) / trainingStats.length
      : 0;

    // Additional minutes based on calorie burn
    const calorieAdjustment = Math.floor(avgCaloriesBurned / 100) * 5;

    // Calculate total recommended sleep time in minutes
    const totalMinutes = baseMinutes + activityMultiplier + frequencyMultiplier + calorieAdjustment;
    
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    };
  }, []);

  return {
    sleepStats,
    statsLoading,
    calculateRecommendedSleep
  };
};

// Fonction utilitaire pour calculer la variance
function calculateVariance(numbers: number[]): number {
  if (numbers.length <= 1) return 0;
  
  const avg = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
  const squareDiffs = numbers.map(value => {
    const diff = value - avg;
    return diff * diff;
  });
  
  return squareDiffs.reduce((sum, val) => sum + val, 0) / numbers.length;
}
