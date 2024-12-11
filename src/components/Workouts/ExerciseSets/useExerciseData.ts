import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useExerciseData = (exerciseIds: string[]) => {
  const [exerciseNames, setExerciseNames] = useState<{ [key: string]: string }>({});
  const [previousWeights, setPreviousWeights] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchExerciseNames = async () => {
      try {
        if (!exerciseIds?.length) {
          console.log('No exercise IDs provided');
          return;
        }

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

        // Fetch or create weight records for each exercise
        if (user) {
          for (const exercise of Object.values(namesMap)) {
            try {
              const { data: weightData, error: weightError } = await supabase
                .from('user_exercise_weights')
                .select('weight')
                .eq('user_id', user.id)
                .eq('exercise_name', exercise)
                .maybeSingle();

              if (weightError) throw weightError;

              if (!weightData) {
                // Create a new weight record if none exists
                const { error: insertError } = await supabase
                  .from('user_exercise_weights')
                  .insert({
                    user_id: user.id,
                    exercise_name: exercise,
                    weight: 20 // Default weight
                  });

                if (insertError) throw insertError;
                
                setPreviousWeights(prev => ({
                  ...prev,
                  [exercise]: 20
                }));
              } else {
                setPreviousWeights(prev => ({
                  ...prev,
                  [exercise]: weightData.weight
                }));
              }
            } catch (error) {
              console.error('Error managing weight data:', error);
              toast({
                title: "Erreur",
                description: "Impossible de gérer les données de poids",
                variant: "destructive",
              });
            }
          }
        }
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
  }, [exerciseIds, toast, user]);

  return { exerciseNames, previousWeights };
};