import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";

interface Exercise {
  id: string;
  name: string;
  media_url?: string | null;
}

export const useExerciseSelection = (muscleGroup?: string) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching exercises for muscle group:', muscleGroup);

        let query = supabase
          .from('exercises')
          .select(`
            id,
            name,
            muscle_group,
            exercise_media (
              media_url,
              media_type
            )
          `)
          .eq('is_published', true); // Ne récupérer que les exercices publiés

        if (muscleGroup) {
          const translatedGroup = translateMuscleGroup(muscleGroup);
          console.log('Muscle group translation:', {
            original: muscleGroup,
            translated: translatedGroup
          });
          query = query.eq('muscle_group', translatedGroup.toLowerCase());
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching exercises:', error);
          throw error;
        }

        console.log('Raw exercises data:', data);

        if (!data) {
          setExercises([]);
          return;
        }

        const exercisesWithMedia = data.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          media_url: exercise.exercise_media?.[0]?.media_url || null
        }));

        console.log('Processed exercises:', exercisesWithMedia);
        setExercises(exercisesWithMedia);
      } catch (error) {
        console.error('Error in fetchExercises:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les exercices",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [muscleGroup, toast]);

  return { exercises, isLoading };
};