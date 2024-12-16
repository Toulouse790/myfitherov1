import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";

export const useExerciseFetching = () => {
  const [exerciseCounts, setExerciseCounts] = useState<{[key: string]: number}>({});
  const { toast } = useToast();

  const fetchExercises = async () => {
    try {
      console.log('Starting exercise count...');
      const { data: exercises, error } = await supabase
        .from('unified_exercises')
        .select('id, name, muscle_group')
        .eq('est_publié', true);  // Changed from is_published to est_publié

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }

      const counts: {[key: string]: number} = {};
      
      if (exercises) {
        exercises.forEach(exercise => {
          if (!exercise.muscle_group) {
            console.warn(`Exercise without muscle group:`, exercise);
            return;
          }
          const translatedGroup = translateMuscleGroup(exercise.muscle_group).toLowerCase();
          counts[translatedGroup] = (counts[translatedGroup] || 0) + 1;
        });
      }

      console.log('Final exercise count by group:', counts);
      setExerciseCounts(counts);
      return exercises?.map(ex => ex.name) || [];
    } catch (error) {
      console.error('Error counting exercises:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les exercices",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    exerciseCounts,
    fetchExercises
  };
};