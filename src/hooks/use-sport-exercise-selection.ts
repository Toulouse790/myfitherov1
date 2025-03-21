
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSportExerciseSelection = (sportId?: string, positionId?: string) => {
  const [exercises, setExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExercises = async () => {
      if (!sportId || !positionId) {
        setExercises([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Chargement des exercices pour le sport:", sportId, "et le poste:", positionId);

        const { data, error } = await supabase
          .from('sport_exercises_recommendations')
          .select(`
            *,
            exercise:unified_exercises(id, name)
          `)
          .eq('sport_id', sportId)
          .eq('position_id', positionId);

        if (error) {
          console.error("Erreur lors de la requête Supabase:", error);
          throw error;
        }

        console.log("Données reçues de Supabase:", data);
        
        if (!data || data.length === 0) {
          console.log("Aucun exercice trouvé, utilisation d'exercices de secours");
          // Utiliser des exercices de secours
          const fallbackExercises = getFallbackExercises();
          setExercises(fallbackExercises);
          return;
        }

        const exerciseNames = data.map(item => item.exercise.name);
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
        const fallbackExercises = getFallbackExercises();
        setExercises(fallbackExercises);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [sportId, positionId, toast]);

  // Fonction qui retourne des exercices de secours génériques pour les sports
  const getFallbackExercises = (): string[] => {
    return [
      "Squat", 
      "Développé couché", 
      "Tractions", 
      "Fentes", 
      "Soulevé de terre",
      "Gainage", 
      "Sprint", 
      "Burpees"
    ];
  };

  return { exercises, isLoading };
};
