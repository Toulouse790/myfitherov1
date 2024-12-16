import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  difficulty: string[];
  location?: string[];
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
        console.log("Chargement des exercices pour le groupe musculaire:", muscleGroup);
        
        let query = supabase
          .from('unified_exercises')
          .select('*');

        if (muscleGroup) {
          query = query.eq('muscle_group', muscleGroup.toLowerCase());
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        console.log("Exercices chargés:", data);
        setExercises(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des exercices:', error);
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