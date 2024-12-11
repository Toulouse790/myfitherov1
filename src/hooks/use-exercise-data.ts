import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useExerciseData = (exerciseIds: string[]) => {
  const [exerciseNames, setExerciseNames] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchExerciseNames = async () => {
      try {
        // Check if exerciseIds is defined and not empty
        if (!exerciseIds?.length) {
          console.log('No exercise IDs provided');
          return;
        }

        // Filter out any undefined or null IDs
        const validIds = exerciseIds.filter(id => id && typeof id === 'string');
        
        if (validIds.length === 0) {
          console.log('No valid exercise IDs found');
          return;
        }

        console.log('Fetching exercises with IDs:', validIds);

        const { data, error } = await supabase
          .from('unified_exercises')
          .select('id, name')
          .in('id', validIds);

        if (error) throw error;

        const namesMap = (data || []).reduce((acc: { [key: string]: string }, exercise) => {
          acc[exercise.id] = exercise.name;
          return acc;
        }, {});

        console.log('Fetched exercise names:', namesMap);
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

    fetchExerciseNames();
  }, [exerciseIds, toast]);

  return { exerciseNames };
};