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
      
      const { data: existingRecords, error: fetchError } = await supabase
        .from('muscle_recovery')
        .select('*')
        .eq('user_id', userId)
        .eq('muscle_group', exerciseName);

      if (fetchError) throw fetchError;

      if (existingRecords && existingRecords.length > 0) {
        const { error: updateError } = await supabase
          .from('muscle_recovery')
          .update({
            last_trained_at: new Date().toISOString(),
            intensity,
            recovery_status: 'fatigued',
            estimated_recovery_hours: estimatedRecoveryHours
          })
          .eq('user_id', userId)
          .eq('muscle_group', exerciseName);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('muscle_recovery')
          .insert({
            user_id: userId,
            muscle_group: exerciseName,
            intensity,
            recovery_status: 'fatigued',
            estimated_recovery_hours: estimatedRecoveryHours
          });

        if (insertError) throw insertError;
      }
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