import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExerciseSets } from "../ExerciseSets";
import { ExerciseList } from "./ExerciseList";

interface WorkoutInProgressProps {
  exercises: string[];
  currentExerciseIndex: number | null;
  onExerciseClick: (index: number) => void;
  onEndWorkout: () => void;
}

export const WorkoutInProgress = ({
  exercises,
  currentExerciseIndex,
  onExerciseClick,
  onEndWorkout,
}: WorkoutInProgressProps) => {
  return (
    <>
      <Card className="border">
        <div className="p-4 space-y-6">
          {currentExerciseIndex !== null && (
            <ExerciseSets
              exerciseName={exercises[currentExerciseIndex]}
            />
          )}
          <ExerciseList
            exercises={exercises}
            currentExerciseIndex={currentExerciseIndex}
            isWorkoutStarted={true}
            onExerciseClick={onExerciseClick}
          />
        </div>
      </Card>

      <div className="fixed bottom-8 left-0 right-0 px-4">
        <Button 
          variant="destructive"
          onClick={onEndWorkout}
          className="w-full max-w-2xl mx-auto"
        >
          Terminer l'entraînement
        </Button>
      </div>
    </>
  );
};