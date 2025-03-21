
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSleepDevices } from "./use-sleep-devices";
import { useSleepSubmission } from "./use-sleep-submission";
import { useSleepStats } from "./use-sleep-stats";
import { SleepSession } from "@/types/sleep";

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
    connectDevice,
    disconnectDevice,
    syncDevice
  } = useSleepDevices();

  const {
    addSleepSession,
    isSubmitting
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
    isSubmitting,
    
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
    disconnectDevice,
    syncDevice,
    refetchSleepSessions,
    calculateRecommendedSleep
  };
};
