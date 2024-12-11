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

        // Filter out any undefined, null, or invalid IDs
        const validIds = exerciseIds.filter((id): id is string => {
          const isValid = id && typeof id === 'string';
          if (!isValid) {
            console.log('Invalid exercise ID found:', id);
          }
          return isValid;
        });
        
        if (validIds.length === 0) {
          console.log('No valid exercise IDs found');
          return;
        }

        console.log('Fetching exercises with IDs:', validIds);

        const { data, error } = await supabase
          .from('unified_exercises')
          .select('id, name')
          .in('id', validIds);

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        if (!data) {
          console.log('No data returned from query');
          return;
        }

        const namesMap = data.reduce<{ [key: string]: string }>((acc, exercise) => {
          if (exercise.id && exercise.name) {
            acc[exercise.id] = exercise.name;
          }
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