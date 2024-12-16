import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const muscleGroupMapping: { [key: string]: string } = {
  "Pectoraux": "chest",
  "Dos": "back",
  "Jambes": "legs",
  "Épaules": "shoulders",
  "Biceps": "biceps",
  "Triceps": "triceps",
  "Abdominaux": "abs",
  "Cardio": "cardio"
};

export const useExerciseSelection = (muscleGroup?: string) => {
  const [exercises, setExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        console.log("Chargement des exercices pour le groupe musculaire:", muscleGroup);

        let query = supabase
          .from('unified_exercises')
          .select('name');

        if (muscleGroup) {
          const normalizedGroup = muscleGroupMapping[muscleGroup] || muscleGroup.toLowerCase();
          console.log("Groupe musculaire normalisé:", normalizedGroup);
          query = query.eq('muscle_group', normalizedGroup);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        console.log("Données reçues de Supabase:", data);
        
        if (!data) {
          setExercises([]);
          return;
        }

        const exerciseNames = data.map(exercise => exercise.name);
        console.log("Exercices trouvés:", exerciseNames);
        setExercises(exerciseNames);

      } catch (error) {
        console.error("Erreur lors du chargement des exercices:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les exercices",
          variant: "destructive",
        });
        setExercises([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [muscleGroup, toast]);

  return { exercises, isLoading };
};