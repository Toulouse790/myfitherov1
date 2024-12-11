import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { normalizeMuscleGroup } from './muscleGroupUtils';
import { useToast } from '@/hooks/use-toast';

interface RecoveryStatus {
  muscleGroup: string;
  status: 'recovered' | 'partial' | 'fatigued';
  remainingHours: number;
}

export const useRecoveryData = () => {
  const [recoveryStatus, setRecoveryStatus] = useState<RecoveryStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRecoveryData = async (muscleGroups: string[]) => {
    if (!user || !muscleGroups.length) {
      console.log('No user or muscle groups provided');
      return [];
    }

    try {
      setIsLoading(true);
      
      const normalizedGroups = muscleGroups
        .filter(Boolean)
        .map(group => {
          const normalized = normalizeMuscleGroup(group);
          console.log(`Normalized muscle group: ${group} -> ${normalized}`);
          return normalized;
        });

      console.log('Querying muscle groups:', normalizedGroups);
      
      const { data, error } = await supabase
        .from('muscle_recovery')
        .select('*')
        .eq('user_id', user.id)
        .in('muscle_group', normalizedGroups);

      if (error) {
        console.error('Error fetching recovery data:', error);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de récupérer les données de récupération. Veuillez réessayer.",
          variant: "destructive",
        });
        return [];
      }

      console.log('Recovery data fetched:', data);
      return data || [];

    } catch (error) {
      console.error('Error in fetchRecoveryData:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des données",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecoveryData = async (
    muscleGroup: string,
    intensity: number,
    estimatedRecoveryHours: number
  ) => {
    if (!user) return false;

    try {
      const normalizedGroup = normalizeMuscleGroup(muscleGroup);
      console.log('Updating recovery data for:', {
        muscleGroup,
        normalizedGroup,
        intensity,
        estimatedRecoveryHours
      });
      
      const { error } = await supabase
        .from('muscle_recovery')
        .upsert({
          user_id: user.id,
          muscle_group: normalizedGroup,
          intensity,
          estimated_recovery_hours: estimatedRecoveryHours,
          last_trained_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,muscle_group'
        });

      if (error) {
        console.error('Error updating recovery data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour les données de récupération",
          variant: "destructive",
        });
        throw error;
      }
      return true;
    } catch (error) {
      console.error('Error updating recovery data:', error);
      return false;
    }
  };

  return {
    recoveryStatus,
    isLoading,
    fetchRecoveryData,
    updateRecoveryData
  };
};