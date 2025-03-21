import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSleepDevices, SleepDevice } from "./use-sleep-devices";
import { useSleepSubmission } from "./use-sleep-submission";
import { useSleepStats } from "./use-sleep-stats";

export interface SleepSession {
  id?: string;
  user_id?: string;
  start_time: string;
  end_time: string;
  total_duration_minutes: number;
  quality_metrics: SleepQualityMetrics;
  environmental_data: EnvironmentalData;
  sleep_score?: number;
  is_nap?: boolean;
}

export interface SleepQualityMetrics {
  sleep_quality: number; // 1-10
  deep_sleep_percentage: number;
  rem_sleep_percentage: number;
  light_sleep_percentage?: number;
  awake_time_minutes?: number;
  wake_count?: number;
}

export interface EnvironmentalData {
  temperature: number;
  noise_level: number;
  light_level: number;
  humidity?: number;
}

export interface SleepStats {
  average_duration: number;
  average_score: number;
  sleep_debt_minutes: number;
  weekly_trend: number; // positif = amélioration
  consistency_score: number;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  lastSync?: string;
}

export const useSleepTracking = () => {
  const { user } = useAuth();
  
  // État de base pour le suivi du sommeil
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [sleepMinutes, setSleepMinutes] = useState<number>(0);
  const [sleepQuality, setSleepQuality] = useState<number>(5);
  const [temperature, setTemperature] = useState<number>(20);
  const [noiseLevel, setNoiseLevel] = useState<number>(25);
  const [lightLevel, setLightLevel] = useState<number>(2);
  const [isNap, setIsNap] = useState<boolean>(false);
  
  // Utilisation des hooks spécialisés
  const { 
    connectedDevices, 
    connectDevice 
  } = useSleepDevices();

  const {
    addSleepSession
  } = useSleepSubmission({
    sleepHours,
    sleepMinutes,
    sleepQuality,
    temperature,
    noiseLevel,
    lightLevel,
    isNap
  });

  const {
    sleepStats,
    calculateRecommendedSleep
  } = useSleepStats();

  // Récupérer toutes les sessions de sommeil de l'utilisateur
  const { 
    data: sleepSessions,
    isLoading,
    isError,
    refetch: refetchSleepSessions
  } = useQuery({
    queryKey: ['sleep-sessions'],
    queryFn: async () => {
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('sleep_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data as SleepSession[];
    },
    enabled: !!user
  });

  return {
    // État
    sleepHours,
    sleepMinutes,
    sleepQuality,
    temperature,
    noiseLevel,
    lightLevel,
    isNap,
    connectedDevices,
    
    // Setters
    setSleepHours,
    setSleepMinutes,
    setSleepQuality,
    setTemperature,
    setNoiseLevel,
    setLightLevel,
    setIsNap,
    
    // Données
    sleepSessions,
    sleepStats,
    isLoading,
    isError,
    
    // Actions
    addSleepSession,
    connectDevice,
    refetchSleepSessions,
    calculateRecommendedSleep
  };
};
