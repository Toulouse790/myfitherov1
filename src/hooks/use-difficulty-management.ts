import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDifficultyManagement = (exerciseId: string, initialDifficulties: string[]) => {
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(initialDifficulties);
  const { toast } = useToast();

  const handleDifficultyChange = async (difficulty: string) => {
    console.log('Changing difficulty:', {
      exerciseId,
      difficulty,
      currentDifficulties: selectedDifficulties
    });

    const newDifficulties = selectedDifficulties.includes(difficulty)
      ? selectedDifficulties.filter(d => d !== difficulty)
      : [...selectedDifficulties, difficulty];

    console.log('New difficulties array:', newDifficulties);

    try {
      const { data, error } = await supabase
        .from('exercises')
        .update({ difficulty: newDifficulties })
        .eq('id', exerciseId)
        .select();

      if (error) {
        console.error('Error updating difficulty:', error);
        throw error;
      }

      console.log('Update successful:', data);
      setSelectedDifficulties(newDifficulties);
      
      toast({
        title: "Succès",
        description: "Niveau de difficulté mis à jour",
      });
    } catch (error) {
      console.error('Error updating difficulty:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le niveau de difficulté",
        variant: "destructive",
      });
    }
  };

  return {
    selectedDifficulties,
    handleDifficultyChange
  };
};