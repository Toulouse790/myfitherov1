import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useMuscleRecoveryManagement = (userId: string | undefined) => {
  const { toast } = useToast();

  const updateMuscleRecovery = async (
    exerciseName: string,
    intensity: number,
    duration: number
  ) => {
    if (!userId) return;

    try {
      const estimatedRecoveryHours = 48;
      
      // Use upsert operation instead of insert
      const { error } = await supabase
        .from('muscle_recovery')
        .upsert({
          user_id: userId,
          muscle_group: exerciseName,
          intensity,
          recovery_status: 'fatigued',
          estimated_recovery_hours: estimatedRecoveryHours,
          last_trained_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,muscle_group',
          ignoreDuplicates: false
        });

      if (error) throw error;

      console.log('Successfully updated muscle recovery for:', exerciseName);
    } catch (error) {
      console.error('Error updating muscle recovery:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de récupération",
        variant: "destructive",
      });
    }
  };

  return { updateMuscleRecovery };
};