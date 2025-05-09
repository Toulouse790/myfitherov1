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

        if (!user) {
          console.log('No user found - authentication required');
          toast({
            title: "Authentification requise",
            description: "Veuillez vous connecter pour accéder à vos données d'exercices",
            variant: "destructive",
          });
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

        if (error) {
          console.error('Error fetching exercise data:', error);
          throw error;
        }

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

        // Gestion des poids
        const weightsMap: { [key: string]: number } = {};
        
        for (const exerciseName of validNames) {
          try {
            // Utiliser upsert pour gérer les poids existants
            const { data: weightData, error: upsertError } = await supabase
              .from('user_exercise_weights')
              .upsert(
                {
                  user_id: user.id,
                  exercise_name: exerciseName,
                  weight: 20,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                },
                {
                  onConflict: 'user_id,exercise_name',
                  ignoreDuplicates: false
                }
              )
              .select('weight')
              .single();

            if (upsertError) {
              console.error('Error upserting weight:', upsertError);
              throw upsertError;
            }

            weightsMap[exerciseName] = weightData?.weight || 20;
            
          } catch (error) {
            console.error(`Error handling weight for ${exerciseName}:`, error);
            weightsMap[exerciseName] = 20;
          }
        }

        console.log('Fetched/created weights:', weightsMap);
        setPreviousWeights(weightsMap);

      } catch (error) {
        console.error('Error in fetchExerciseData:', error);
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