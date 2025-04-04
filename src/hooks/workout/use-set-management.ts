import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface UseSetManagementProps {
  sessionId: string | null;
  exerciseName?: string;
  initialReps?: number;
  onSetsChange?: (newSets: number) => void;
}

export const useSetManagement = ({
  sessionId,
  exerciseName,
  initialReps = 12,
  onSetsChange
}: UseSetManagementProps) => {
  const [completedSets, setCompletedSets] = useState<{ [key: string]: number }>({});
  const [weights, setWeights] = useState<{ [key: string]: number }>({});
  const [reps, setReps] = useState<{ [key: string]: number }>({});
  const [repsPerSet, setRepsPerSet] = useState<{ [key: number]: number }>({});
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddSet = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter une série",
        variant: "destructive"
      });
      return;
    }

    if (exerciseName && onSetsChange) {
      const currentSets = completedSets[exerciseName] || 0;
      const newSetsCount = currentSets + 1;
      setCompletedSets(prev => ({
        ...prev,
        [exerciseName]: newSetsCount
      }));
      onSetsChange(newSetsCount);
    }
  };

  const handleRepsChange = (setIndex: number, value: number) => {
    setRepsPerSet(prev => ({
      ...prev,
      [setIndex]: value
    }));
  };

  const handleSetComplete = async (
    exerciseName: string,
    exerciseDisplayName: string,
    setRestTimers: (fn: (prev: { [key: string]: number | null }) => { [key: string]: number | null }) => void,
    setIsExerciseTransition: (value: boolean) => void,
    difficulty: string,
    notes: string,
    calories: number
  ) => {
    if (!sessionId || !user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté et avoir une session active pour enregistrer une série",
        variant: "destructive"
      });
      throw new Error("Session ID or user missing");
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
    repsPerSet,
    setWeights,
    setReps,
    handleSetComplete,
    handleAddSet,
    handleRepsChange
  };
};