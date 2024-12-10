import { ExerciseAnimation } from "../ExerciseAnimation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

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
          } else {
            console.log('No previous weight found for exercise:', currentExercise);
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

        if (error) throw error;
        
        // Start rest timer automatically after set completion
        onSetComplete();
      } catch (error) {
        console.error('Error saving set:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {workoutStarted && onEndWorkout && (
          <Button 
            variant="destructive"
            onClick={onEndWorkout}
            size="sm"
            className="whitespace-nowrap"
          >
            Terminer la séance
          </Button>
        )}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">
            {currentExercise || "Sélectionnez un exercice"}
          </h2>
          {currentExercise && (
            <p className="text-sm text-muted-foreground">
              Charge recommandée : {previousWeight}kg
            </p>
          )}
        </div>
        <span className="text-muted-foreground">
          {currentExerciseIndex !== null ? `${currentExerciseIndex + 1}/${exercises.length}` : ""}
        </span>
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {exercises.map((exercise, index) => (
          <Button
            key={index}
            variant={currentExerciseIndex === index ? "default" : "ghost"}
            onClick={() => onExerciseSelect(index)}
            className={`p-4 transition-all ${
              currentExerciseIndex === index 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            }`}
          >
            {exercise}
          </Button>
        ))}
      </div>
    </div>
  );
};