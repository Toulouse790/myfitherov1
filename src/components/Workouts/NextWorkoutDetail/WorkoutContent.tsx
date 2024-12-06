import { ExerciseList } from "./ExerciseList";
import { WorkoutInProgress } from "./WorkoutInProgress";

interface WorkoutContentProps {
  exercises: string[];
  currentExerciseIndex: number | null;
  workoutStarted: boolean;
  completedExercises: number[];
  sessionId: string | null;
  onExerciseClick: (index: number) => void;
  onRegenerateWorkout: () => void;
  onExerciseComplete: (index: number) => void;
}

export const WorkoutContent = ({
  exercises,
  currentExerciseIndex,
  workoutStarted,
  completedExercises,
  sessionId,
  onExerciseClick,
  onRegenerateWorkout,
  onExerciseComplete
}: WorkoutContentProps) => {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
      <div className="space-y-6">
        <ExerciseList
          exercises={exercises}
          currentExerciseIndex={currentExerciseIndex}
          isWorkoutStarted={workoutStarted}
          onExerciseClick={onExerciseClick}
          completedExercises={completedExercises}
        />
      </div>

      <div>
        {workoutStarted ? (
          <WorkoutInProgress
            exercises={exercises}
            currentExerciseIndex={currentExerciseIndex}
            onExerciseClick={onExerciseClick}
            sessionId={sessionId}
            onRegenerateWorkout={onRegenerateWorkout}
            onExerciseComplete={onExerciseComplete}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-6 text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed">
            <p className="text-xl">
              Cliquez sur "Commencer ma séance" pour démarrer votre entraînement
            </p>
          </div>
        )}
      </div>
    </div>
  );
};