
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SleepStats, SleepRecommendation } from "@/types/sleep";

export const useSleepStats = () => {
  const { user } = useAuth();
  const [sleepStats, setSleepStats] = useState<SleepStats>({
    average_duration: 420, // 7 heures en minutes
    average_score: 85,
    sleep_debt_minutes: 30,
    weekly_trend: 5,  // 5% d'amélioration
    consistency_score: 8
  });

  useEffect(() => {
    if (user) {
      fetchSleepStats();
    }
  }, [user]);

  const fetchSleepStats = async () => {
    try {
      const { data, error } = await supabase
        .from('sleep_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setSleepStats({
          average_duration: data.average_duration || 420,
          average_score: data.average_score || 85,
          sleep_debt_minutes: data.sleep_debt_minutes || 30,
          weekly_trend: data.weekly_trend || 0,
          consistency_score: data.consistency_score || 7
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques de sommeil:", error);
    }
  };

  const calculateRecommendedSleep = (
    experienceLevel: string,
    trainingFrequency: number,
    workoutDuration: number,
    trainingStats: any[]
  ): SleepRecommendation => {
    // Base de 7-8 heures pour un adulte en bonne santé
    let recommendedHours = 7;
    let recommendedMinutes = 30;
    
    // Facteurs d'ajustement basés sur l'intensité de l'entraînement
    if (experienceLevel === 'advanced' && trainingFrequency > 4) {
      recommendedHours += 0.5;
    }
    
    if (workoutDuration > 90) {
      recommendedMinutes += 15;
    }
    
    // Ajustement basé sur la dépense calorique récente
    const recentCaloriesBurned = trainingStats.reduce((total, stat) => 
      total + (stat.calories_burned || 0), 0);
    
    if (recentCaloriesBurned > 5000) {
      recommendedMinutes += 15;
    }
    
    // Normalisation des minutes
    if (recommendedMinutes >= 60) {
      recommendedHours += Math.floor(recommendedMinutes / 60);
      recommendedMinutes = recommendedMinutes % 60;
    }
    
    return { hours: recommendedHours, minutes: recommendedMinutes };
  };

  return {
    sleepStats,
    calculateRecommendedSleep
  };
};
