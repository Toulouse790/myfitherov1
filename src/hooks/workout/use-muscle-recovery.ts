import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { muscleRecoveryData } from "@/utils/workoutPlanning";

interface MuscleRecoveryStatus {
  muscleGroup: string;
  recoveryStatus: 'recovered' | 'partial' | 'fatigued';
  estimatedRecoveryHours: number;
  intensity: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const useMuscleRecovery = (muscleGroups: string[]) => {
  const [recoveryStatus, setRecoveryStatus] = useState<MuscleRecoveryStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Helper function to retry failed requests
  const fetchWithRetry = async (retryCount = 0) => {
    if (!user || !muscleGroups.length) return;

    try {
      // Ensure muscle groups are properly encoded
      const encodedMuscleGroups = muscleGroups.map(group => encodeURIComponent(group));
      
      console.log('Fetching recovery status for muscle groups:', muscleGroups);
      
      const { data: recoveryData, error } = await supabase
        .from('muscle_recovery')
        .select('*')
        .eq('user_id', user.id)
        .in('muscle_group', muscleGroups); // Supabase handles encoding internally

      if (error) throw error;

      const currentStatus = muscleGroups.map(group => {
        const lastTraining = recoveryData?.find(d => d.muscle_group === group);
        const baseRecovery = muscleRecoveryData[group]?.recoveryTime || 48;
        
        let status: 'recovered' | 'partial' | 'fatigued' = 'recovered';
        let remainingHours = 0;

        if (lastTraining) {
          const hoursSinceTraining = Math.floor(
            (new Date().getTime() - new Date(lastTraining.last_trained_at).getTime()) / (1000 * 60 * 60)
          );
          
          remainingHours = Math.max(0, lastTraining.estimated_recovery_hours - hoursSinceTraining);
          
          if (remainingHours > baseRecovery / 2) {
            status = 'fatigued';
          } else if (remainingHours > 0) {
            status = 'partial';
          }
        }

        return {
          muscleGroup: group,
          recoveryStatus: status,
          estimatedRecoveryHours: remainingHours,
          intensity: lastTraining?.intensity || 0
        };
      });

      setRecoveryStatus(currentStatus);
    } catch (error) {
      console.error('Error fetching recovery status:', error);
      
      // Retry logic
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying fetch (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        setTimeout(() => {
          fetchWithRetry(retryCount + 1);
        }, RETRY_DELAY * (retryCount + 1));
        return;
      }

      toast({
        title: "Erreur",
        description: "Impossible de charger le statut de récupération",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithRetry();
  }, [user, muscleGroups, toast]);

  const updateRecoveryStatus = async (
    muscleGroup: string,
    intensity: number,
    sessionDuration: number
  ) => {
    if (!user) return;

    try {
      const baseRecovery = muscleRecoveryData[muscleGroup]?.recoveryTime || 48;
      const intensityFactor = intensity > 0.8 ? 1.2 : intensity > 0.6 ? 1 : 0.8;
      const durationFactor = sessionDuration > 60 ? 1.2 : 1;
      const estimatedRecoveryHours = Math.round(baseRecovery * intensityFactor * durationFactor);

      const { error } = await supabase
        .from('muscle_recovery')
        .upsert({
          user_id: user.id,
          muscle_group: muscleGroup,
          last_trained_at: new Date().toISOString(),
          intensity,
          recovery_status: 'fatigued',
          estimated_recovery_hours: estimatedRecoveryHours
        }, {
          onConflict: 'user_id,muscle_group'
        });

      if (error) throw error;

      // Update local state
      setRecoveryStatus(prev => prev.map(status => 
        status.muscleGroup === muscleGroup
          ? {
              ...status,
              recoveryStatus: 'fatigued',
              estimatedRecoveryHours,
              intensity
            }
          : status
      ));

    } catch (error) {
      console.error('Error updating recovery status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de récupération",
        variant: "destructive",
      });
    }
  };

  return {
    recoveryStatus,
    isLoading,
    updateRecoveryStatus
  };
};