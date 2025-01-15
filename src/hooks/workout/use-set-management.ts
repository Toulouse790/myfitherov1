import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseSetManagementProps {
  sessionId: string | null;
  exercises: string[];
  onExerciseComplete?: (index: number) => void;
  currentExerciseIndex?: number;
}

export const useSetManagement = ({
  sessionId,
  exercises,
  onExerciseComplete,
  currentExerciseIndex
}: UseSetManagementProps) => {
  const [completedSets, setCompletedSets] = useState<{ [key: string]: number }>({});
  const [weights, setWeights] = useState<{ [key: string]: number }>({});
  const [reps, setReps] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const handleSetComplete = async (
    exerciseName: string,
    exerciseDisplayName: string,
    setRestTimers: (fn: (prev: { [key: string]: number | null }) => { [key: string]: number | null }) => void,
    setIsExerciseTransition: (value: boolean) => void,
    difficulty: string,
    notes: string,
    calories: number
  ) => {
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const currentSets = completedSets[exerciseName] || 0;
    const newSetsCount = currentSets + 1;
    
    try {
      const { error } = await supabase
        .from('exercise_sets')
        .insert({
          session_id: sessionId,
          exercise_name: exerciseDisplayName,
          set_number: newSetsCount,
          reps: reps[exerciseName],
          weight: weights[exerciseName],
          rest_time_seconds: 90,
          perceived_difficulty: difficulty,
          notes: notes,
          calories_burned: calories
        });

      if (error) throw error;

      setCompletedSets(prev => ({
        ...prev,
        [exerciseName]: newSetsCount
      }));
      
      setRestTimers(prev => ({
        ...prev,
        [exerciseName]: 90
      }));

      if (newSetsCount === 3) {
        setIsExerciseTransition(true);
        toast({
          title: "Exercice terminé !",
          description: "Repos de 90 secondes avant le prochain exercice.",
        });
        
        if (typeof currentExerciseIndex === 'number' && onExerciseComplete) {
          onExerciseComplete(currentExerciseIndex);
        }
      } else {
        toast({
          title: "Série complétée !",
          description: `${calories} calories brûlées. Repos de 90 secondes.`,
        });
      }
    } catch (error) {
      console.error('Error saving set data:', error);
      throw error;
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