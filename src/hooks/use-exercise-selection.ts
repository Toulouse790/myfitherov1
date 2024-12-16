import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
          .select('name')
          .eq('est_publié', true);

        if (muscleGroup) {
          // Utiliser directement l'ID du groupe musculaire
          console.log("Recherche des exercices pour le groupe:", muscleGroup);
          query = query.eq('muscle_group', muscleGroup);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Erreur lors de la requête Supabase:", error);
          throw error;
        }

        console.log("Données reçues de Supabase:", data);
        
        if (!data) {
          console.log("Aucune donnée reçue de Supabase");
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