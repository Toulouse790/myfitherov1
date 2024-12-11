import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { normalizeMuscleGroup } from './muscleGroupUtils';
import { useToast } from '@/hooks/use-toast';

interface RecoveryData {
  muscle_group: string;
  last_trained_at: string;
  intensity: number;
  estimated_recovery_hours: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useRecoveryData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecoveryData = async (
    muscleGroups: string[],
    retryCount = 0
  ): Promise<RecoveryData[] | null> => {
    if (!user || !muscleGroups.length) return null;
    
    try {
      setIsLoading(true);
      
      // Normalize all muscle groups consistently
      const normalizedGroups = muscleGroups
        .filter(Boolean)
        .map(group => normalizeMuscleGroup(group));
      
      console.log('Normalized muscle groups for query:', normalizedGroups);
      
      const { data, error } = await supabase
        .from('muscle_recovery')
        .select('*')
        .eq('user_id', user.id)
        .in('muscle_group', normalizedGroups);

      if (error) throw error;
      
      console.log('Recovery data fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching recovery data:', error);
      
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchRecoveryData(muscleGroups, retryCount + 1);
      }
      
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les données de récupération",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecoveryData = async (
    muscleGroup: string,
    intensity: number,
    estimatedRecoveryHours: number
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const normalizedGroup = normalizeMuscleGroup(muscleGroup);
      console.log('Updating recovery data for normalized group:', normalizedGroup);
      
      const { error } = await supabase
        .from('muscle_recovery')
        .upsert({
          user_id: user.id,
          muscle_group: normalizedGroup,
          last_trained_at: new Date().toISOString(),
          intensity,
          recovery_status: 'fatigued',
          estimated_recovery_hours: estimatedRecoveryHours
        }, {
          onConflict: 'user_id,muscle_group'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating recovery data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les données de récupération",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    fetchRecoveryData,
    updateRecoveryData,
    isLoading
  };
};