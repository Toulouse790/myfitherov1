import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  difficulty: string[];
  is_published?: boolean;
  exercise_media?: {
    media_url: string;
    media_type: string;
  }[];
}

export const useExerciseSelection = (muscleGroup?: string, userLevel: string = 'beginner') => {
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
            *,
            exercise_media (
              media_url,
              media_type
            )
          `)
          .eq('is_published', true);

        if (muscleGroup) {
          const translatedGroup = translateMuscleGroup(muscleGroup);
          console.log('Filtering by muscle group:', translatedGroup);
          query = query.ilike('muscle_group', translatedGroup.toLowerCase());
        }

        // Filtrer par niveau de difficulté
        query = query.contains('difficulty', [userLevel]);

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        // Supprimer les doublons basés sur l'ID
        const uniqueExercises = data?.reduce((acc: Exercise[], current) => {
          const exists = acc.find((exercise) => exercise.id === current.id);
          if (!exists) {
            acc.push(current);
          } else {
            console.log('Duplicate exercise found:', current.name);
          }
          return acc;
        }, []) || [];

        console.log('Fetched exercises:', uniqueExercises);
        setExercises(uniqueExercises);
      } catch (error) {
        console.error('Error fetching exercises:', error);
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
  }, [muscleGroup, userLevel, toast]);

  return { exercises, isLoading };
};