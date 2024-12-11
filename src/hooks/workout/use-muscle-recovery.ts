import { useState, useEffect } from 'react';
import { useRecoveryData } from './utils/useRecoveryData';
import { calculateRecoveryStatus } from './utils/muscleGroupUtils';
import { muscleRecoveryData } from '../../data/muscleRecoveryData';

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
        
        // Normaliser les noms des groupes musculaires
        const normalizedGroups = muscleGroups.map(group => 
          group.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '_')
        );
        
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
            d.muscle_group.toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, '_') === normalizedGroup
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
    const normalizedGroup = muscleGroup.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');

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