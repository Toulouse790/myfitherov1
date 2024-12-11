import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRecoveryManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const updateRecoveryStatus = async (
    exerciseName: string,
    intensity: number,
    duration: number
  ) => {
    try {
      if (!user) {
        console.error("No user available");
        return;
      }

      const normalizedName = exerciseName.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_');

      console.log("Updating recovery status for:", {
        exerciseName,
        normalizedName,
        userId: user.id
      });

      const { error: recoveryError } = await supabase
        .from('muscle_recovery')
        .upsert({
          user_id: user.id,
          muscle_group: normalizedName,
          intensity: intensity,
          recovery_status: 'fatigued',
          estimated_recovery_hours: 48,
          last_trained_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,muscle_group'
        });

      if (recoveryError) {
        console.error('Error updating recovery status:', recoveryError);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le statut de récupération",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in updateRecoveryStatus:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut de récupération",
        variant: "destructive",
      });
    }
  };

  return { updateRecoveryStatus };
};