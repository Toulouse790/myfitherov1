import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDifficultyManagement = (exerciseId: string, initialDifficulties: string[]) => {
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(initialDifficulties);
  const { toast } = useToast();

  const handleDifficultyChange = async (difficulty: string) => {
    const newDifficulties = selectedDifficulties.includes(difficulty)
      ? selectedDifficulties.filter(d => d !== difficulty)
      : [...selectedDifficulties, difficulty];

    try {
      const { error } = await supabase
        .from('exercises')
        .update({ difficulty: newDifficulties })
        .eq('id', exerciseId);

      if (error) throw error;

      setSelectedDifficulties(newDifficulties);
      toast({
        title: "Succès",
        description: "Difficulté mise à jour",
      });
    } catch (error) {
      console.error('Error updating difficulty:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la difficulté",
        variant: "destructive",
      });
    }
  };

  return {
    selectedDifficulties,
    handleDifficultyChange
  };
};