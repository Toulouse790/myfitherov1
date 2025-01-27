import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RecoveryStatus {
  muscleGroup: string;
  status: 'recovered' | 'partial' | 'fatigued';
  recoveryTime: number;
}

export const useMuscleRecovery = (muscleGroups: string[]) => {
  const [recoveryStatus, setRecoveryStatus] = useState<RecoveryStatus[]>([]);

  useEffect(() => {
    const fetchRecoveryStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('muscle_recovery')
          .select('*')
          .in('muscle_group', muscleGroups);

        if (error) throw error;

        const status = muscleGroups.map(group => {
          const muscleData = data?.find(d => d.muscle_group === group);
          return {
            muscleGroup: group,
            status: muscleData?.recovery_status || 'recovered',
            recoveryTime: muscleData?.estimated_recovery_hours || 0
          };
        });

        setRecoveryStatus(status);
      } catch (error) {
        console.error('Error fetching recovery status:', error);
      }
    };

    if (muscleGroups.length > 0) {
      fetchRecoveryStatus();
    }
  }, [muscleGroups]);

  return { recoveryStatus };
};