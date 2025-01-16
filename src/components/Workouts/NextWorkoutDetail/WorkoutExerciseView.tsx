import { ExerciseAnimation } from "../ExerciseAnimation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { WorkoutHeader } from "./components/WorkoutHeader";
import { ExerciseButtons } from "./components/ExerciseButtons";

interface WorkoutExerciseViewProps {
  currentExercise: string | null;
  currentExerciseIndex: number | null;
  exercises: string[];
  currentSet: number;
  isResting: boolean;
  sessionId: string | null;
  restTime: number;
  onSetComplete: () => void;
  onSetsChange: (newSets: number) => void;
  onRestTimeChange: (newTime: number) => void;
  onExerciseSelect: (index: number) => void;
  onEndWorkout?: () => void;
  workoutStarted?: boolean;
}

export const WorkoutExerciseView = ({
  currentExercise,
  currentExerciseIndex,
  exercises,
  currentSet,
  isResting,
  sessionId,
  restTime,
  onSetComplete,
  onSetsChange,
  onRestTimeChange,
  onExerciseSelect,
  onEndWorkout,
  workoutStarted,
}: WorkoutExerciseViewProps) => {
  const [previousWeight, setPreviousWeight] = useState<number>(20);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPreviousWeight = async () => {
      if (currentExercise && user) {
        try {
          const { data, error } = await supabase
            .from('user_exercise_weights')
            .select('weight')
            .eq('user_id', user.id)
            .eq('exercise_name', currentExercise)
            .single();

          if (!error && data) {
            setPreviousWeight(data.weight);
          }
        } catch (error) {
          console.error('Error fetching weight:', error);
        }
      }
    };

    fetchPreviousWeight();
  }, [currentExercise, user]);

  const handleSetComplete = async () => {
    if (currentExercise && sessionId) {
      try {
        const { error } = await supabase
          .from('exercise_sets')
          .insert({
            session_id: sessionId,
            exercise_name: currentExercise,
            set_number: currentSet,
            reps: 12,
            weight: previousWeight,
            rest_time_seconds: restTime,
            completed_at: new Date().toISOString()
          });

        if (error) {
          toast({
            title: "Erreur",
            description: "Impossible de sauvegarder la série",
            variant: "destructive",
          });
          throw error;
        }
        
        onSetComplete();
        
        toast({
          title: "Série complétée !",
          description: "Début de la période de repos",
        });
      } catch (error) {
        console.error('Error saving set:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <WorkoutHeader
        currentExercise={currentExercise}
        currentExerciseIndex={currentExerciseIndex}
        exercisesCount={exercises.length}
        workoutStarted={workoutStarted}
        onEndWorkout={onEndWorkout}
        previousWeight={previousWeight}
      />

      {currentExercise && (
        <ExerciseAnimation
          reps={12}
          restTime={restTime}
          sets={3}
          currentSet={currentSet}
          isResting={isResting}
          sessionId={sessionId}
          weight={previousWeight}
          exerciseName={currentExercise}
          onSetComplete={handleSetComplete}
          onSetsChange={onSetsChange}
          onRestTimeChange={onRestTimeChange}
        />
      )}

      <ExerciseButtons
        exercises={exercises}
        currentExerciseIndex={currentExerciseIndex}
        onExerciseSelect={onExerciseSelect}
      />
    </div>
  );
};