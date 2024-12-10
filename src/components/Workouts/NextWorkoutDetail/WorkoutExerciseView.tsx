import { ExerciseAnimation } from "../ExerciseAnimation";
import { Button } from "@/components/ui/button";

interface WorkoutExerciseViewProps {
  currentExercise: string | null;
  currentExerciseIndex: number | null;
  exercises: string[];
  currentSet: number;
  isResting: boolean;
  progress: number;
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
  progress,
  sessionId,
  restTime,
  onSetComplete,
  onSetsChange,
  onRestTimeChange,
  onExerciseSelect,
  onEndWorkout,
  workoutStarted,
}: WorkoutExerciseViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
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
                Charge recommandée : 20-30kg
              </p>
            )}
          </div>
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
          progress={progress}
          sessionId={sessionId}
          onSetComplete={onSetComplete}
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