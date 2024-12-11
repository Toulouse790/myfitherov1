import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useExerciseData = (exerciseNames: string[]) => {
  const [exerciseData, setExerciseData] = useState<{ [key: string]: string }>({});
  const [previousWeights, setPreviousWeights] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        if (!exerciseNames?.length) {
          console.log('No exercise names provided');
          return;
        }

        const validNames = exerciseNames.filter((name): name is string => {
          const isValid = name && typeof name === 'string';
          if (!isValid) {
            console.log('Invalid exercise name found:', name);
          }
          return isValid;
        });
        
        if (validNames.length === 0) {
          console.log('No valid exercise names found');
          return;
        }

        console.log('Fetching exercises with names:', validNames);

        const { data, error } = await supabase
          .from('unified_exercises')
          .select('name')
          .in('name', validNames);

        if (error) throw error;

        if (!data) {
          console.log('No data returned from query');
          return;
        }

        const namesMap = data.reduce<{ [key: string]: string }>((acc, exercise) => {
          if (exercise.name) {
            acc[exercise.name] = exercise.name;
          }
          return acc;
        }, {});

        console.log('Fetched exercise names:', namesMap);
        setExerciseData(namesMap);

        // Fetch weights for each exercise individually to avoid encoding issues
        if (user) {
          const weightsMap: { [key: string]: number } = {};
          
          for (const exerciseName of validNames) {
            const { data: weightData, error: weightError } = await supabase
              .from('user_exercise_weights')
              .select('exercise_name, weight')
              .eq('exercise_name', exerciseName)
              .eq('user_id', user.id)
              .maybeSingle();

            if (weightError) {
              console.error('Error fetching weight for exercise:', exerciseName, weightError);
              continue;
            }

            weightsMap[exerciseName] = weightData?.weight || 20;
          }

          console.log('Fetched weights:', weightsMap);
          setPreviousWeights(weightsMap);
        }
      } catch (error) {
        console.error('Error fetching exercise data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données des exercices",
          variant: "destructive",
        });
      }
    };

    fetchExerciseData();
  }, [exerciseNames, toast, user]);

  return { exerciseNames: exerciseData, previousWeights };
};