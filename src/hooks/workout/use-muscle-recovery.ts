import { useState, useEffect } from 'react';
import { useRecoveryData } from './utils/useRecoveryData';
import { calculateRecoveryStatus } from './utils/muscleGroupUtils';
import { muscleRecoveryData } from '../../data/muscleRecoveryData';
import { normalizeMuscleGroup } from './utils/muscleGroupUtils';

interface RecoveryStatus {
  muscleGroup: string;
  status: 'recovered' | 'partial' | 'fatigued';
  remainingHours: number;
}

export const useMuscleRecovery = (muscleGroups: string[]) => {
  const [recoveryStatus, setRecoveryStatus] = useState<RecoveryStatus[]>([]);
  const { isLoading, fetchRecoveryData, updateRecoveryData } = useRecoveryData();

  useEffect(() => {
    const updateRecoveryStatus = async () => {
      if (!muscleGroups.length) return;

      try {
        console.log('Fetching recovery data for muscle groups:', muscleGroups);
        
        const normalizedGroups = muscleGroups.map(group => normalizeMuscleGroup(group));
        
        console.log('Normalized muscle groups:', normalizedGroups);
        
        const recoveryData = await fetchRecoveryData(normalizedGroups);
        if (!recoveryData) {
          console.log('No recovery data returned');
          return;
        }

        console.log('Recovery data fetched:', recoveryData);

        const currentStatus = muscleGroups.map((group, index) => {
          const normalizedGroup = normalizedGroups[index];
          const lastTraining = recoveryData.find(d => 
            normalizeMuscleGroup(d.muscle_group) === normalizedGroup
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

        console.log('Updated recovery status:', currentStatus);
        setRecoveryStatus(currentStatus);
      } catch (error) {
        console.error('Error updating recovery status:', error);
      }
    };

    updateRecoveryStatus();
  }, [muscleGroups, fetchRecoveryData]);

  const updateRecoveryStatus = async (
    muscleGroup: string,
    intensity: number,
    sessionDuration: number
  ) => {
    const normalizedGroup = normalizeMuscleGroup(muscleGroup);
    const baseRecovery = muscleRecoveryData[muscleGroup]?.recoveryTime || 48;
    const estimatedRecoveryHours = Math.round(baseRecovery * intensity);
    
    console.log('Updating recovery status for:', {
      originalGroup: muscleGroup,
      normalizedGroup,
      intensity,
      estimatedRecoveryHours
    });
    
    const success = await updateRecoveryData(normalizedGroup, intensity, estimatedRecoveryHours);
    
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