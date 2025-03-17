
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";

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
          // Traduire l'ID du groupe musculaire pour la requête
          const muscleGroupId = translateMuscleGroup(muscleGroup);
          console.log("Recherche des exercices pour le groupe traduit:", muscleGroupId);
          
          // Utiliser ilike pour une recherche insensible à la casse et partielle
          query = query.ilike('muscle_group', `%${muscleGroupId}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Erreur lors de la requête Supabase:", error);
          throw error;
        }

        console.log("Données reçues de Supabase:", data);
        
        if (!data || data.length === 0) {
          console.log("Aucun exercice trouvé, utilisation d'exercices de secours");
          // Utiliser des exercices de secours pour ce groupe musculaire
          const fallbackExercises = getFallbackExercises(muscleGroup);
          setExercises(fallbackExercises);
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
        
        // Utiliser des exercices de secours en cas d'erreur
        const fallbackExercises = getFallbackExercises(muscleGroup);
        setExercises(fallbackExercises);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [muscleGroup, toast]);

  // Fonction qui retourne des exercices de secours par groupe musculaire
  const getFallbackExercises = (group?: string): string[] => {
    if (!group) return [];

    const fallbackMap: { [key: string]: string[] } = {
      'chest': ["Développé couché", "Écarté avec haltères", "Pompes"],
      'back': ["Tractions", "Rowing barre", "Tirage poitrine"],
      'legs': ["Squat", "Fentes", "Extension des jambes"],
      'shoulders': ["Développé militaire", "Élévations latérales", "Élévations frontales"],
      'biceps': ["Curl biceps", "Curl marteau", "Curl incliné"],
      'triceps': ["Dips", "Extension triceps", "Barre au front"],
      'abs': ["Crunch", "Planche", "Relevé de jambes"]
    };

    return fallbackMap[group.toLowerCase()] || [];
  };

  return { exercises, isLoading };
};
