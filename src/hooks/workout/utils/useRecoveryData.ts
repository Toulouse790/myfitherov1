import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { normalizeMuscleGroup } from './muscleGroupUtils';

interface RecoveryStatus {
  muscleGroup: string;
  status: string;
  remainingHours: number;
}

export const useRecoveryData = (muscleGroups: string[]) => {
  const [recoveryStatus, setRecoveryStatus] = useState<RecoveryStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecoveryData = async () => {
    if (!user || !muscleGroups.length) {
      console.log('No user or muscle groups provided');
      return [];
    }

    try {
      setIsLoading(true);
      
      // Filter out empty values and normalize muscle groups
      const normalizedGroups = muscleGroups
        .filter(Boolean)
        .map(group => normalizeMuscleGroup(group));

      console.log('Normalized muscle groups for query:', normalizedGroups);
      
      const { data, error } = await supabase
        .from('muscle_recovery')
        .select('*')
        .eq('user_id', user.id)
        .in('muscle_group', normalizedGroups);

      if (error) {
        console.error('Error fetching recovery data:', error);
        throw error;
      }

      console.log('Recovery data fetched:', data);
      return data || [];

    } catch (error) {
      console.error('Error in fetchRecoveryData:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecoveryStatus = (data: any[]) => {
    const currentTime = new Date().getTime();
    const updatedStatus = muscleGroups.map(group => {
      const normalizedGroup = normalizeMuscleGroup(group);
      const recoveryData = data.find(d => d.muscle_group === normalizedGroup);

      if (!recoveryData) {
        return {
          muscleGroup: group,
          status: 'recovered',
          remainingHours: 0
        };
      }

      const lastTrainedTime = new Date(recoveryData.last_trained_at).getTime();
      const recoveryTimeMs = recoveryData.estimated_recovery_hours * 60 * 60 * 1000;
      const remainingTimeMs = Math.max(0, (lastTrainedTime + recoveryTimeMs) - currentTime);
      const remainingHours = Math.ceil(remainingTimeMs / (60 * 60 * 1000));

      return {
        muscleGroup: group,
        status: remainingHours > 0 ? 'fatigued' : 'recovered',
        remainingHours
      };
    });

    console.log('Updated recovery status:', updatedStatus);
    setRecoveryStatus(updatedStatus);
  };

  useEffect(() => {
    const loadRecoveryData = async () => {
      console.log('Fetching recovery data for muscle groups:', muscleGroups);
      const data = await fetchRecoveryData();
      updateRecoveryStatus(data);
    };

    loadRecoveryData();
  }, [user, muscleGroups.join(',')]);

  return { recoveryStatus, isLoading };
};