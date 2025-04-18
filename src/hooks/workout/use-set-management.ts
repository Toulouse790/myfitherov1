import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

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
  const { t } = useLanguage();

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
        title: t("common.error"),
        description: t("auth.signInRequired"),
        variant: "destructive"
      });
      throw new Error("Session ID or user missing");
    }

    const currentSets = completedSets[exerciseName] || 0;
    const newSetsCount = currentSets + 1;
    
    try {
      debugLogger.log("useSetManagement", "Saving set", {
        exerciseName,
        setNumber: newSetsCount,
        sessionId
      });

      const { data, error } = await supabase
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
        })
        .select()
        .single();

      if (error) {
        debugLogger.error("useSetManagement", "Database error saving set:", error);
        throw error;
      }

      if (!data) {
        throw new Error(t("workouts.errors.noDataReturned"));
      }

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
          title: t("workouts.exerciseCompleted"),
          description: t("workouts.restBeforeNext"),
        });
      } else {
        toast({
          title: t("workouts.setCompleted"),
          description: t("workouts.caloriesBurned", { 
            params: { calories: calories }
          }),
        });
      }
    } catch (error) {
      debugLogger.error('useSetManagement', 'Error saving set data:', error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.setSaveFailed"),
        variant: "destructive",
      });
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
