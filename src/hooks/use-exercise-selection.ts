import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  difficulty: string[];
  is_published?: boolean;
  image_url?: string;
  video_url?: string;
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

        if (!muscleGroup) {
          setExercises([]);
          return;
        }

        const { data, error } = await supabase
          .from('unified_exercises')
          .select('*')
          .eq('is_published', true)
          .eq('muscle_group', muscleGroup.toLowerCase());

        if (error) {
          console.error('Error fetching exercises:', error);
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
  }, [muscleGroup, toast]);

  return { exercises, isLoading };
};