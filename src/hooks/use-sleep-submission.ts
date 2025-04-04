import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { SleepSession, SleepQualityMetrics, EnvironmentalData } from "@/types/sleep";

interface SleepSubmissionProps {
  sleepHours: number;
  sleepMinutes: number;
  sleepQuality: number;
  temperature: number;
  noiseLevel: number;
  lightLevel: number;
  isNap: boolean;
}

export const useSleepSubmission = ({
  sleepHours,
  sleepMinutes,
  sleepQuality,
  temperature,
  noiseLevel,
  lightLevel,
  isNap
}: SleepSubmissionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSleepSession = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer une session de sommeil.",
        variant: "destructive"
      });
      return;
    }

    if (sleepHours === 0 && sleepMinutes === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez spécifier une durée de sommeil valide.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Conversion en minutes
      const totalMinutes = (sleepHours * 60) + sleepMinutes;
      
      // Calcul des pourcentages approximatifs des phases de sommeil
      const deepSleepPercentage = sleepQuality > 7 ? 25 : 20;
      const remSleepPercentage = sleepQuality > 5 ? 23 : 18;
      
      const qualityMetrics: SleepQualityMetrics = {
        sleep_quality: sleepQuality,
        deep_sleep_percentage: deepSleepPercentage,
        rem_sleep_percentage: remSleepPercentage,
        light_sleep_percentage: 100 - deepSleepPercentage - remSleepPercentage,
        awake_time_minutes: Math.round(totalMinutes * 0.05), // ~5% du temps total
        wake_count: Math.floor(Math.random() * 5) + 1 // 1-5 réveils
      };
      
      const environmentalData: EnvironmentalData = {
        temperature: temperature,
        noise_level: noiseLevel,
        light_level: lightLevel,
        humidity: Math.floor(Math.random() * 30) + 40 // 40-70% d'humidité
      };
      
      // Calcul approximatif du score de sommeil (0-100)
      const sleepScore = Math.round(
        (sleepQuality * 5) + 
        (deepSleepPercentage * 0.8) + 
        (remSleepPercentage * 0.6) - 
        (qualityMetrics.wake_count * 2)
      );
      
      // Dates pour la session de sommeil
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - (totalMinutes * 60 * 1000));
      
      const sleepSession: SleepSession = {
        user_id: user.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        total_duration_minutes: totalMinutes,
        quality_metrics: qualityMetrics,
        sleep_score: Math.min(Math.max(sleepScore, 0), 100), // Limiter entre 0-100
        is_nap: isNap
      };
      
      const { data, error } = await supabase
        .from('sleep_sessions')
        .insert([sleepSession]);
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Votre session de sommeil a été enregistrée.",
      });
      
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la session de sommeil:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    addSleepSession,
    isSubmitting
  };
};
