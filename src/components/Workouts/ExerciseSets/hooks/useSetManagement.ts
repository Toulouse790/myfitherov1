import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseSetManagementProps {
  exercises: string[];
  sessionId?: string | null;
  onExerciseComplete?: (index: number) => void;
  currentExerciseIndex?: number;
}

export const useSetManagement = ({
  exercises,
  sessionId,
  onExerciseComplete,
  currentExerciseIndex
}: UseSetManagementProps) => {
  const [completedSets, setCompletedSets] = useState<{ [key: string]: number }>({});
  const [weights, setWeights] = useState<{ [key: string]: number }>({});
  const [reps, setReps] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  useEffect(() => {
    const initialWeights: { [key: string]: number } = {};
    const initialReps: { [key: string]: number } = {};
    exercises.forEach(exercise => {
      initialWeights[exercise] = 20;
      initialReps[exercise] = 12;
    });
    setWeights(initialWeights);
    setReps(initialReps);
  }, [exercises]);

  const handleSetComplete = async (
    exerciseId: string,
    exerciseName: string,
    setRestTimers: (fn: (prev: { [key: string]: number | null }) => { [key: string]: number | null }) => void,
    setIsExerciseTransition: (value: boolean) => void,
    difficulty: string,
    notes: string,
    calories: number
  ) => {
    const currentSets = completedSets[exerciseId] || 0;
    
    if (currentSets < 3) {
      const newSetsCount = currentSets + 1;
      setCompletedSets(prev => ({
        ...prev,
        [exerciseId]: newSetsCount
      }));
      
      setRestTimers(prev => ({
        ...prev,
        [exerciseId]: 90
      }));

      if (sessionId) {
        try {
          const { error } = await supabase
            .from('exercise_sets')
            .insert({
              session_id: sessionId,
              exercise_name: exerciseName,
              set_number: newSetsCount,
              reps: reps[exerciseId],
              weight: weights[exerciseId],
              rest_time_seconds: 90,
              perceived_difficulty: difficulty,
              notes: notes,
              calories_burned: calories
            })
            .single();

          if (error) throw error;

          toast({
            title: "Série complétée !",
            description: `${calories} calories brûlées. Repos de 90 secondes.`,
          });

        } catch (error) {
          console.error('Error saving set data:', error);
          throw error;
        }
      }

      if (newSetsCount === 3) {
        setIsExerciseTransition(true);
        toast({
          title: "Exercice terminé !",
          description: "Repos de 90 secondes avant le prochain exercice.",
        });
        setRestTimers(prev => ({
          ...prev,
          [exerciseId]: 90
        }));
      }
    }
  };

  return {
    completedSets,
    weights,
    reps,
    setWeights,
    setReps,
    handleSetComplete
  };
};