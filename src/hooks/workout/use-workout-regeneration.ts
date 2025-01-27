import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWorkoutRegeneration = () => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { toast } = useToast();

  const handleRegenerateWorkout = async (userId: string) => {
    if (!userId || isRegenerating) return;

    setIsRegenerating(true);
    try {
      const { error } = await supabase
        .from('workout_sessions')
        .update({ is_adapted: true })
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre séance a été régénérée",
      });
    } catch (error) {
      console.error('Error regenerating workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de régénérer la séance",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return { handleRegenerateWorkout, isRegenerating };
};