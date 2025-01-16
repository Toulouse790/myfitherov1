import { Button } from "@/components/ui/button";

interface WorkoutHeaderProps {
  currentExercise: string | null;
  currentExerciseIndex: number | null;
  exercisesCount: number;
  workoutStarted?: boolean;
  onEndWorkout?: () => void;
  previousWeight: number;
}

export const WorkoutHeader = ({
  currentExercise,
  currentExerciseIndex,
  exercisesCount,
  workoutStarted,
  onEndWorkout,
  previousWeight,
}: WorkoutHeaderProps) => {
  return (
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
        {currentExerciseIndex !== null ? `${currentExerciseIndex + 1}/${exercisesCount}` : ""}
      </span>
    </div>
  );
};