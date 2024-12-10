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
          .from('unified_exercises')  // Changed from 'exercises' to 'unified_exercises'
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
          console.log('Filtering by muscle group (translated):', translatedGroup);
          query = query.eq('muscle_group', translatedGroup);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          console.log('Fetched exercises:', data);
          setExercises(data);
        }
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