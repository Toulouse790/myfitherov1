import { supabase } from "@/integrations/supabase/client";

export const useRecoveryManagement = () => {
  const updateRecoveryStatus = async (
    exerciseName: string,
    intensity: number,
    duration: number
  ) => {
    try {
      const { error } = await supabase
        .from('muscle_recovery')
        .update({
          intensity,
          training_volume: duration,
          last_trained_at: new Date().toISOString()
        })
        .eq('muscle_group', exerciseName.toLowerCase());

      if (error) throw error;
    } catch (error) {
      console.error('Error updating recovery status:', error);
    }
  };

  return { updateRecoveryStatus };
};