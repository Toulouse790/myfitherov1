import { Card } from "@/components/ui/card";
import { ExerciseList } from "./ExerciseList";
import { CurrentExercise } from "./CurrentExercise";

interface WorkoutLayoutProps {
  exercises: string[];
  currentExerciseIndex: number | null;
  onExerciseClick: (index: number) => void;
  isWorkoutStarted: boolean;
  completedExercises: number[];
}

export const WorkoutLayout = ({
  exercises,
  currentExerciseIndex,
  onExerciseClick,
  isWorkoutStarted,
  completedExercises
}: WorkoutLayoutProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-4 h-fit md:sticky md:top-4">
        <ExerciseList
          exercises={exercises}
          currentExerciseIndex={currentExerciseIndex}
          isWorkoutStarted={isWorkoutStarted}
          onExerciseClick={onExerciseClick}
          completedExercises={completedExercises}
        />
      </Card>
      
      <div className="md:col-span-2">
        <CurrentExercise
          exercises={exercises}
          currentExerciseIndex={currentExerciseIndex}
        />
      </div>
    </div>
  );
};