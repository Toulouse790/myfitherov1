import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SessionTimer } from "./ExerciseSets/SessionTimer";
import { ExerciseCard } from "./ExerciseSets/ExerciseCard";

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
  const [completedSets, setCompletedSets] = useState<{ [key: string]: number }>({});
  const [weights, setWeights] = useState<{ [key: string]: number }>({});
  const [reps, setReps] = useState<{ [key: string]: number }>({});
  const [restTimers, setRestTimers] = useState<{ [key: string]: number | null }>({});
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [totalRestTime, setTotalRestTime] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    Object.entries(restTimers).forEach(([exerciseName, timer]) => {
      if (timer !== null && timer > 0) {
        intervals[exerciseName] = setInterval(() => {
          setRestTimers(prev => {
            const currentTimer = prev[exerciseName];
            if (currentTimer === null || currentTimer <= 1) {
              clearInterval(intervals[exerciseName]);
              toast({
                title: "Repos terminé !",
                description: "C'est reparti ! Commencez la série suivante.",
              });
              return { ...prev, [exerciseName]: null };
            }
            return { ...prev, [exerciseName]: currentTimer - 1 };
          });
          setTotalRestTime(prev => prev + 1);
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, [restTimers, toast]);

  const handleSetComplete = async (exerciseName: string) => {
    const currentSets = completedSets[exerciseName] || 0;
    
    if (currentSets < 3) {
      const newSetsCount = currentSets + 1;
      setCompletedSets(prev => ({
        ...prev,
        [exerciseName]: newSetsCount
      }));
      
      setRestTimers(prev => ({
        ...prev,
        [exerciseName]: 90
      }));

      if (sessionId) {
        try {
          const { error } = await supabase
            .from('exercise_sets')
            .insert({
              session_id: sessionId,
              exercise_name: exerciseName,
              set_number: newSetsCount,
              reps: reps[exerciseName],
              weight: weights[exerciseName],
              rest_time_seconds: 90
            });

          if (error) throw error;

          await supabase
            .from('workout_sessions')
            .update({ 
              total_duration_minutes: Math.floor(sessionDuration / 60),
              total_rest_time_seconds: totalRestTime
            })
            .eq('id', sessionId);

        } catch (error) {
          console.error('Error saving set data:', error);
          toast({
            title: "Erreur",
            description: "Impossible de sauvegarder les données de la série",
            variant: "destructive",
          });
        }
      }

      const calories = Math.round(reps[exerciseName] * weights[exerciseName] * 0.15);
      toast({
        title: "Série complétée !",
        description: `${calories} calories brûlées. Repos de 90 secondes.`,
      });

      if (newSetsCount === 3) {
        toast({
          title: "Exercice terminé !",
          description: "Passez à l'exercice suivant.",
        });
        if (onExerciseComplete && currentExerciseIndex !== undefined) {
          onExerciseComplete(currentExerciseIndex);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <SessionTimer duration={sessionDuration} />

      {exercises.map((exerciseName) => (
        <ExerciseCard
          key={exerciseName}
          exerciseName={exerciseName}
          weight={weights[exerciseName] || 0}
          reps={reps[exerciseName] || 0}
          completedSets={completedSets[exerciseName] || 0}
          restTimer={restTimers[exerciseName]}
          onWeightChange={(value) => setWeights(prev => ({ ...prev, [exerciseName]: value }))}
          onRepsChange={(value) => setReps(prev => ({ ...prev, [exerciseName]: value }))}
          onSetComplete={() => handleSetComplete(exerciseName)}
        />
      ))}
    </div>
  );
};