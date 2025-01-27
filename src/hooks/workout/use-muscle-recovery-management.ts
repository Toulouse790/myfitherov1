import { supabase } from "@/integrations/supabase/client";

export const useMuscleRecoveryManagement = (userId: string | undefined) => {
  const updateMuscleRecovery = async (
    exerciseName: string,
    intensity: number,
    duration: number
  ) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('muscle_recovery')
        .upsert({
          user_id: userId,
          muscle_group: exerciseName.toLowerCase(),
          intensity,
          last_trained_at: new Date().toISOString(),
          estimated_recovery_hours: Math.round(duration * intensity)
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating muscle recovery:', error);
    }
  };

  return { updateMuscleRecovery };
};