import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useExerciseData = (exerciseIds: string[]) => {
  const [exerciseNames, setExerciseNames] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchExerciseNames = async () => {
      try {
        const { data, error } = await supabase
          .from('unified_exercises')
          .select('id, name')
          .in('id', exerciseIds);

        if (error) throw error;

        const namesMap = (data || []).reduce((acc: { [key: string]: string }, exercise) => {
          acc[exercise.id] = exercise.name;
          return acc;
        }, {});

        setExerciseNames(namesMap);
      } catch (error) {
        console.error('Error fetching exercise names:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les noms des exercices",
          variant: "destructive",
        });
      }
    };

    if (exerciseIds.length > 0) {
      fetchExerciseNames();
    }
  }, [exerciseIds, toast]);

  return { exerciseNames };
};