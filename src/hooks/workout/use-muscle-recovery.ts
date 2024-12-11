import { useState, useEffect } from 'react';
import { useRecoveryData } from './utils/useRecoveryData';
import { calculateRecoveryStatus, calculateRecoveryHours } from './utils/muscleGroupUtils';
import { muscleRecoveryData } from '@/data/muscleRecoveryData';

interface RecoveryStatus {
  muscleGroup: string;
  status: 'recovered' | 'partial' | 'fatigued';
  remainingHours: number;
}

export const useMuscleRecovery = (muscleGroups: string[]) => {
  const [recoveryStatus, setRecoveryStatus] = useState<RecoveryStatus[]>([]);
  const { fetchRecoveryData, updateRecoveryData, isLoading } = useRecoveryData();

  useEffect(() => {
    const updateRecoveryStatus = async () => {
      if (!muscleGroups.length) return;

      const recoveryData = await fetchRecoveryData(muscleGroups);
      if (!recoveryData) return;

      const currentStatus = muscleGroups.map(group => {
        const lastTraining = recoveryData.find(d => 
          d.muscle_group === group
        );
        const baseRecovery = muscleRecoveryData[group]?.recoveryTime || 48;
        
        const { status, remainingHours } = calculateRecoveryStatus(
          lastTraining ? new Date(lastTraining.last_trained_at) : null,
          lastTraining?.estimated_recovery_hours || baseRecovery
        );

        return {
          muscleGroup: group,
          status,
          remainingHours
        };
      });

      setRecoveryStatus(currentStatus);
    };

    updateRecoveryStatus();
  }, [muscleGroups]);

  const updateRecoveryStatus = async (
    muscleGroup: string,
    intensity: number,
    sessionDuration: number
  ) => {
    const baseRecovery = muscleRecoveryData[muscleGroup]?.recoveryTime || 48;
    const estimatedRecoveryHours = calculateRecoveryHours(baseRecovery, intensity, sessionDuration);
    
    const success = await updateRecoveryData(muscleGroup, intensity, estimatedRecoveryHours);
    
    if (success) {
      setRecoveryStatus(prev => prev.map(status => 
        status.muscleGroup === muscleGroup
          ? {
              muscleGroup,
              status: 'fatigued',
              remainingHours: estimatedRecoveryHours
            }
          : status
      ));
    }
  };

  return {
    recoveryStatus,
    updateRecoveryStatus,
    isLoading
  };
};