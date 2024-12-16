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
          .select('*')
          .eq('est_publié', true);

        if (muscleGroup) {
          const normalizedGroup = muscleGroup.toLowerCase().replace('pectoraux', 'chest');
          console.log("Groupe musculaire normalisé:", normalizedGroup);
          query = query.eq('muscle_group', normalizedGroup);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erreur lors de la requête Supabase:', error);
          throw error;
        }

        console.log("Données brutes reçues de Supabase:", data);
        console.log("Nombre d'exercices trouvés:", data?.length || 0);
        
        if (data) {
          data.forEach(exercise => {
            console.log("Exercice trouvé:", {
              nom: exercise.name,
              groupe: exercise.muscle_group,
              difficulté: exercise.difficulty,
              location: exercise.location,
              est_publié: exercise.est_publié
            });
          });
        }

        setExercises(data || []);
      } catch (error) {
        console.error('Erreur détaillée lors du chargement des exercices:', error);
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