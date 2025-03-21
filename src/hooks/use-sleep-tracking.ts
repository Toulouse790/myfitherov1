
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Durée du sommeil en heures/minutes
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [sleepMinutes, setSleepMinutes] = useState<number>(0);
  
  // Qualité du sommeil sur 10
  const [sleepQuality, setSleepQuality] = useState<number>(5);
  
  // Données environnementales
  const [temperature, setTemperature] = useState<number>(20);
  const [noiseLevel, setNoiseLevel] = useState<number>(25);
  const [lightLevel, setLightLevel] = useState<number>(2);
  const [isNap, setIsNap] = useState<boolean>(false);
  
  // Appareils connectés
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);

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
  
  // Récupérer les statistiques de sommeil
  const { 
    data: sleepStats,
    isLoading: statsLoading 
  } = useQuery({
    queryKey: ['sleep-stats'],
    queryFn: async () => {
      if (!user || !sleepSessions || sleepSessions.length === 0) {
        return null;
      }
      
      // Calculer les statistiques à partir des sessions
      const last7Days = sleepSessions.filter(
        session => new Date(session.end_time) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      
      if (last7Days.length === 0) {
        return null;
      }
      
      const avgDuration = last7Days.reduce((sum, session) => sum + session.total_duration_minutes, 0) / last7Days.length;
      const avgScore = last7Days.reduce((sum, session) => sum + (session.sleep_score || 0), 0) / last7Days.length;
      
      // Calcul de la dette de sommeil (basé sur un besoin de 8h par nuit)
      const sleepDebt = last7Days.reduce(
        (debt, session) => debt + Math.max(0, 480 - session.total_duration_minutes), 
        0
      );
      
      // Calculer la tendance: comparer moyenne des 3 derniers jours vs 4 jours précédents
      const recent = last7Days.slice(0, 3);
      const previous = last7Days.slice(3);
      
      const recentAvg = recent.length > 0 
        ? recent.reduce((sum, s) => sum + (s.sleep_score || 0), 0) / recent.length 
        : 0;
        
      const previousAvg = previous.length > 0 
        ? previous.reduce((sum, s) => sum + (s.sleep_score || 0), 0) / previous.length 
        : 0;
        
      const trend = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;
      
      // Régularité du sommeil
      const bedTimes = last7Days.map(s => new Date(s.start_time).getHours() * 60 + new Date(s.start_time).getMinutes());
      const wakeTimes = last7Days.map(s => new Date(s.end_time).getHours() * 60 + new Date(s.end_time).getMinutes());
      
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
    enabled: !!user && !!sleepSessions && sleepSessions.length > 0
  });
  
  // Mutation pour ajouter une session de sommeil
  const addSleepSessionMutation = useMutation({
    mutationFn: async (newSession: Omit<SleepSession, 'id' | 'user_id' | 'sleep_score'>) => {
      if (!user) {
        throw new Error("Vous devez être connecté pour enregistrer votre sommeil");
      }

      const { data, error } = await supabase
        .from('sleep_sessions')
        .insert({
          ...newSession,
          user_id: user.id
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['sleep-stats'] });
      
      toast({
        title: "Succès",
        description: "Données de sommeil enregistrées",
      });
      
      // Réinitialiser les formulaires
      setSleepHours(7);
      setSleepMinutes(0);
      setSleepQuality(5);
    },
    onError: (error) => {
      console.error('Error saving sleep data:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les données de sommeil",
        variant: "destructive",
      });
    }
  });
  
  // Fonction pour connecter un appareil
  const connectDevice = useCallback(async () => {
    try {
      // Vérifie si le navigateur supporte le Web Bluetooth
      if (!navigator.bluetooth) {
        toast({
          title: "Non supporté",
          description: "Votre navigateur ne supporte pas le Bluetooth",
          variant: "destructive",
        });
        return;
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { services: ['health_thermometer'] },
          { namePrefix: 'Fitbit' },
          { namePrefix: 'Garmin' },
          { namePrefix: 'Apple Watch' }
        ],
        optionalServices: ['battery_service']
      });

      // Ajouter l'appareil à la liste
      setConnectedDevices(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: device.name,
          type: device.name.includes('Fitbit') ? 'Fitbit' : 
                device.name.includes('Garmin') ? 'Garmin' : 
                device.name.includes('Apple') ? 'Apple Watch' : 'Autre',
          connected: true,
          lastSync: new Date().toISOString()
        }
      ]);

      toast({
        title: "Appareil connecté",
        description: `${device.name} connecté avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à l'appareil",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  // Fonction pour enregistrer une session de sommeil
  const addSleepSession = useCallback(() => {
    const totalMinutes = sleepHours * 60 + sleepMinutes;
    const now = new Date();
    const startTime = new Date(now.getTime() - totalMinutes * 60000);

    const newSession: Omit<SleepSession, 'id' | 'user_id' | 'sleep_score'> = {
      start_time: startTime.toISOString(),
      end_time: now.toISOString(),
      total_duration_minutes: totalMinutes,
      is_nap: isNap,
      quality_metrics: {
        sleep_quality: sleepQuality,
        deep_sleep_percentage: Math.round(sleepQuality * 10),
        rem_sleep_percentage: Math.round(sleepQuality * 8),
      },
      environmental_data: {
        temperature,
        noise_level: noiseLevel,
        light_level: lightLevel,
      }
    };

    addSleepSessionMutation.mutate(newSession);
  }, [
    sleepHours, sleepMinutes, sleepQuality, isNap,
    temperature, noiseLevel, lightLevel, addSleepSessionMutation
  ]);
  
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
