import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ExerciseCard } from "./ExerciseSets/ExerciseCard";
import { ProgressBar } from "./ExerciseSets/ProgressBar";
import { RestTimer } from "./ExerciseSets/RestTimer";
import { SessionTimer } from "./ExerciseSets/SessionTimer";
import { SetButton } from "./ExerciseSets/SetButton";

interface ExerciseSetsProps {
  exercises: string[];
  onExerciseComplete?: (index: number) => void;
  currentExerciseIndex?: number;
  sessionId?: string | null;
}

export const ExerciseSets = ({ 
  exercises,
  onExerciseComplete,
  currentExerciseIndex = 0,
  sessionId
}: ExerciseSetsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [completedSets, setCompletedSets] = useState<{ [key: string]: number }>({});
  const [weights, setWeights] = useState<{ [key: string]: number }>({});
  const [reps, setReps] = useState<{ [key: string]: number }>({});
  const [restTimers, setRestTimers] = useState<{ [key: string]: number | null }>({});
  const [isExerciseTransition, setIsExerciseTransition] = useState(false);

  const currentExercise = exercises[currentExerciseIndex];

  const handleSetComplete = useCallback(async (
    exerciseId: string,
    exerciseName: string,
    difficulty: string,
    notes: string,
    calories: number
  ) => {
    if (!sessionId || !user) {
      toast({
        title: "Erreur",
        description: "Session invalide",
        variant: "destructive",
      });
      return;
    }

    const currentSets = completedSets[exerciseId] || 0;
    const newSetsCount = currentSets + 1;
    
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
        });

      if (error) throw error;

      setCompletedSets(prev => ({
        ...prev,
        [exerciseId]: newSetsCount
      }));
      
      setRestTimers(prev => ({
        ...prev,
        [exerciseId]: 90
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
      console.error('Error saving set:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la série",
        variant: "destructive",
      });
    }
  }, [completedSets, reps, weights, sessionId, user, toast]);

  const handleRestTimeChange = useCallback((exerciseId: string, newTime: number) => {
    setRestTimers(prev => ({
      ...prev,
      [exerciseId]: Math.max(15, Math.min(180, (prev[exerciseId] || 90) + newTime))
    }));
  }, []);

  const handleRestComplete = useCallback((exerciseId: string) => {
    setRestTimers(prev => ({
      ...prev,
      [exerciseId]: null
    }));

    if (isExerciseTransition) {
      setIsExerciseTransition(false);
      if (onExerciseComplete) {
        onExerciseComplete(currentExerciseIndex);
      }
    }
  }, [isExerciseTransition, currentExerciseIndex, onExerciseComplete]);

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

  if (!currentExercise) return null;

  return (
    <div className="space-y-6">
      <ProgressBar 
        completedSets={completedSets[currentExercise] || 0}
        totalSets={3}
      />

      <ExerciseCard
        exerciseName={currentExercise}
        weight={weights[currentExercise] || 20}
        reps={reps[currentExercise] || 12}
        completedSets={completedSets[currentExercise] || 0}
        restTimer={restTimers[currentExercise]}
        onWeightChange={(value) => setWeights(prev => ({ ...prev, [currentExercise]: value }))}
        onRepsChange={(value) => setReps(prev => ({ ...prev, [currentExercise]: value }))}
        onSetComplete={handleSetComplete}
        isTransitioning={isExerciseTransition}
        onRestTimeChange={(time) => handleRestTimeChange(currentExercise, time)}
        onRestComplete={() => handleRestComplete(currentExercise)}
      />
    </div>
  );
};