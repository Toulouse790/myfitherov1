import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Exercise {
  id: string;
  name: string;
  media_url: string | null;
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

        const { data, error } = await supabase
          .from('exercises')
          .select(`
            id,
            name,
            muscle_group,
            exercise_media (
              media_url
            )
          `)
          .eq('is_published', true);

        if (error) {
          console.error('Error fetching exercises:', error);
          throw error;
        }

        console.log('Raw exercises data:', data);

        let filteredExercises = data;
        if (muscleGroup) {
          filteredExercises = data.filter(exercise => {
            const normalizedMuscleGroup = exercise.muscle_group.toLowerCase();
            const searchTerm = muscleGroup.toLowerCase();
            return normalizedMuscleGroup.includes(searchTerm);
          });
        }

        console.log('Filtered exercises:', filteredExercises);

        if (!filteredExercises || filteredExercises.length === 0) {
          toast({
            title: "Aucun exercice trouvé",
            description: "Aucun exercice n'est disponible pour ce groupe musculaire pour le moment.",
            variant: "destructive",
          });
        }

        const exercisesWithMedia = filteredExercises.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          media_url: exercise.exercise_media?.[0]?.media_url || null
        }));

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