import { useExerciseData } from "./ExerciseSets/useExerciseData";
import { SessionTimer } from "./ExerciseSets/SessionTimer";
import { ExerciseCard } from "./ExerciseSets/ExerciseCard";
import { ExerciseProgress } from "./ExerciseSets/ExerciseProgress";
import { useExerciseTimers } from "./ExerciseSets/hooks/useExerciseTimers";
import { useSetManagement } from "./ExerciseSets/hooks/useSetManagement";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { exerciseNames } = useExerciseData(exercises);
  const { toast } = useToast();
  
  const {
    restTimers,
    setRestTimers,
    sessionDuration,
    totalRestTime,
    isExerciseTransition,
    setIsExerciseTransition
  } = useExerciseTimers({ onExerciseComplete, currentExerciseIndex });

  const {
    completedSets,
    weights,
    reps,
    setWeights,
    setReps,
    handleSetComplete
  } = useSetManagement({ exercises, sessionId, onExerciseComplete, currentExerciseIndex });

  const calculateCalories = (weight: number, reps: number): number => {
    // Formule simplifiée : 0.15 calories par répétition par kg
    return Math.round(reps * weight * 0.15);
  };

  const updateSessionStats = async () => {
    if (sessionId) {
      try {
        await supabase
          .from('workout_sessions')
          .update({ 
            total_duration_minutes: Math.floor(sessionDuration / 60),
            total_rest_time_seconds: totalRestTime
          })
          .eq('id', sessionId);
      } catch (error) {
        console.error('Error updating session stats:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour les statistiques de la séance",
          variant: "destructive"
        });
      }
    }
  };

  const handleExerciseSetComplete = async (exerciseName: string, difficulty: string, notes: string) => {
    const weight = weights[exerciseName] || 0;
    const currentReps = reps[exerciseName] || 0;
    const calories = calculateCalories(weight, currentReps);

    await handleSetComplete(
      exerciseName,
      exerciseNames[exerciseName] || exerciseName,
      setRestTimers,
      setIsExerciseTransition,
      difficulty,
      notes,
      calories
    );
    await updateSessionStats();
  };

  return (
    <div className="space-y-6">
      <SessionTimer sessionDuration={sessionDuration} />

      {exercises.map((exerciseName) => (
        <div key={exerciseName} className="space-y-4">
          <ExerciseProgress 
            completedSets={completedSets[exerciseName] || 0}
            totalSets={3}
          />
          <ExerciseCard
            exerciseName={exerciseNames[exerciseName] || exerciseName}
            weight={weights[exerciseName] || 0}
            reps={reps[exerciseName] || 0}
            completedSets={completedSets[exerciseName] || 0}
            restTimer={restTimers[exerciseName]}
            onWeightChange={(value) => setWeights(prev => ({ ...prev, [exerciseName]: value }))}
            onRepsChange={(value) => setReps(prev => ({ ...prev, [exerciseName]: value }))}
            onSetComplete={(difficulty, notes) => handleExerciseSetComplete(exerciseName, difficulty, notes)}
            isTransitioning={isExerciseTransition}
          />
        </div>
      ))}
    </div>
  );
};