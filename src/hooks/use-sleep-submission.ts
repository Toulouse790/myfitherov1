
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SleepSession } from "./use-sleep-tracking";

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
  const queryClient = useQueryClient();

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

  return {
    addSleepSession,
    isSubmitting: addSleepSessionMutation.isPending
  };
};
