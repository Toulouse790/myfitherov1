import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SessionTimer } from "./ExerciseSets/SessionTimer";
import { ExerciseCard } from "./ExerciseSets/ExerciseCard";
import { useExerciseData } from "./ExerciseSets/useExerciseData";
import { ExerciseProgress } from "./ExerciseSets/ExerciseProgress";

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
  const [isExerciseTransition, setIsExerciseTransition] = useState<boolean>(false);
  const { exerciseNames } = useExerciseData(exercises);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    Object.entries(restTimers).forEach(([exerciseId, timer]) => {
      if (timer !== null && timer > 0) {
        intervals[exerciseId] = setInterval(() => {
          setRestTimers(prev => {
            const currentTimer = prev[exerciseId];
            if (currentTimer === null || currentTimer <= 1) {
              clearInterval(intervals[exerciseId]);
              if (isExerciseTransition) {
                setIsExerciseTransition(false);
                if (onExerciseComplete && currentExerciseIndex !== undefined) {
                  onExerciseComplete(currentExerciseIndex);
                }
              } else {
                toast({
                  title: "Repos terminé !",
                  description: "C'est reparti ! Commencez la série suivante.",
                });
              }
              return { ...prev, [exerciseId]: null };
            }
            return { ...prev, [exerciseId]: currentTimer - 1 };
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
  }, [restTimers, toast, isExerciseTransition, onExerciseComplete, currentExerciseIndex]);

  const handleSetComplete = async (exerciseId: string) => {
    const currentSets = completedSets[exerciseId] || 0;
    const exerciseName = exerciseNames[exerciseId] || "Exercice inconnu";
    
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

      const calories = Math.round(reps[exerciseId] * weights[exerciseId] * 0.15);
      toast({
        title: "Série complétée !",
        description: `${calories} calories brûlées. Repos de 90 secondes.`,
      });

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

  return (
    <div className="space-y-6">
      <SessionTimer sessionDuration={sessionDuration} />

      {exercises.map((exerciseId) => (
        <div key={exerciseId} className="space-y-4">
          <ExerciseProgress 
            completedSets={completedSets[exerciseId] || 0}
            totalSets={3}
          />
          <ExerciseCard
            exerciseName={exerciseNames[exerciseId] || "Chargement..."}
            weight={weights[exerciseId] || 0}
            reps={reps[exerciseId] || 0}
            completedSets={completedSets[exerciseId] || 0}
            restTimer={restTimers[exerciseId]}
            onWeightChange={(value) => setWeights(prev => ({ ...prev, [exerciseId]: value }))}
            onRepsChange={(value) => setReps(prev => ({ ...prev, [exerciseId]: value }))}
            onSetComplete={() => handleSetComplete(exerciseId)}
          />
        </div>
      ))}
    </div>
  );
};