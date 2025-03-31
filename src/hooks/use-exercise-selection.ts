
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";

export const useExerciseSelection = (muscleGroup: string = "") => {
  const [exercises, setExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      debugLogger.log("useExerciseSelection", "Chargement des exercices pour le groupe musculaire:", muscleGroup);
      setIsLoading(true);

      try {
        let query = supabase
          .from('unified_exercises')
          .select('name, muscle_group');

        if (muscleGroup) {
          query = query.eq('muscle_group', muscleGroup);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          const exerciseNames = data.map(exercise => exercise.name);
          debugLogger.log("useExerciseSelection", "Exercices trouvés:", exerciseNames.length);
          setExercises(exerciseNames);
        } else {
          debugLogger.warn("useExerciseSelection", "Aucun exercice trouvé");
          setExercises([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des exercices:", error);
        debugLogger.error("useExerciseSelection", "Erreur:", error);
        setExercises([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [muscleGroup]);

  return { exercises, isLoading };
};
