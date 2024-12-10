import { useExerciseData } from "./ExerciseSets/useExerciseData";
import { SessionTimer } from "./ExerciseSets/SessionTimer";
import { ExerciseCard } from "./ExerciseSets/ExerciseCard";
import { ExerciseProgress } from "./ExerciseSets/ExerciseProgress";
import { useExerciseTimers } from "./ExerciseSets/hooks/useExerciseTimers";
import { useSetManagement } from "./ExerciseSets/hooks/useSetManagement";
import { supabase } from "@/integrations/supabase/client";

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
      }
    }
  };

  const handleExerciseSetComplete = async (exerciseId: string) => {
    await handleSetComplete(
      exerciseId,
      exerciseNames[exerciseId] || "Exercice inconnu",
      setRestTimers,
      setIsExerciseTransition
    );
    await updateSessionStats();
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
            onSetComplete={() => handleExerciseSetComplete(exerciseId)}
          />
        </div>
      ))}
    </div>
  );
};