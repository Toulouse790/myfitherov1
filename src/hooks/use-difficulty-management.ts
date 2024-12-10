import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDifficultyManagement = (
  exerciseId: string,
  initialDifficulties: string[]
) => {
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(initialDifficulties);
  const { toast } = useToast();

  const handleDifficultyChange = async (difficulty: string, checked: boolean) => {
    try {
      const newDifficulties = checked
        ? [...selectedDifficulties, difficulty]
        : selectedDifficulties.filter(d => d !== difficulty);

      const { error } = await supabase
        .from('unified_exercises')
        .update({ difficulty: newDifficulties })
        .eq('id', exerciseId);

      if (error) throw error;

      setSelectedDifficulties(newDifficulties);
    } catch (error) {
      console.error('Error updating exercise difficulty:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la difficulté",
        variant: "destructive",
      });
    }
  };

  return {
    selectedDifficulties,
    handleDifficultyChange,
  };
};