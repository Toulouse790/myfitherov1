import { useState, useEffect } from 'react';
import { useRecoveryData } from './utils/useRecoveryData';
import { calculateRecoveryStatus, calculateRecoveryHours } from './utils/muscleGroupUtils';
import { muscleRecoveryData } from '../../data/muscleRecoveryData';

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

      try {
        console.log('Fetching recovery data for muscle groups:', muscleGroups);
        
        // Remove accents and normalize muscle group names
        const normalizedGroups = muscleGroups.map(group => 
          group.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        );
        
        const recoveryData = await fetchRecoveryData(normalizedGroups);
        if (!recoveryData) {
          console.log('No recovery data returned');
          return;
        }

        const currentStatus = muscleGroups.map((group, index) => {
          const normalizedGroup = normalizedGroups[index];
          const lastTraining = recoveryData.find(d => 
            d.muscle_group.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === normalizedGroup
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
  }, [muscleGroups]);

  const updateRecoveryStatus = async (
    muscleGroup: string,
    intensity: number,
    sessionDuration: number
  ) => {
    // Normalize the muscle group name before saving
    const normalizedGroup = muscleGroup.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const baseRecovery = muscleRecoveryData[muscleGroup]?.recoveryTime || 48;
    const estimatedRecoveryHours = calculateRecoveryHours(baseRecovery, intensity, sessionDuration);
    
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