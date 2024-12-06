import { CheckCircle2, Dumbbell } from "lucide-react";

interface ExerciseListProps {
  exercises: string[];
  currentExerciseIndex: number | null;
  isWorkoutStarted: boolean;
  onExerciseClick: (index: number) => void;
  completedExercises: number[];
}

export const ExerciseList = ({
  exercises,
  currentExerciseIndex,
  isWorkoutStarted,
  onExerciseClick,
  completedExercises
}: ExerciseListProps) => {
  return (
    <div className="space-y-2">
      {exercises.map((exercise, index) => {
        const isCompleted = completedExercises.includes(index);
        const isCurrent = currentExerciseIndex === index;

        return (
          <div
            key={index}
            className={`
              p-4 rounded-lg border transition-all cursor-pointer
              ${isCurrent ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}
              ${isCompleted ? 'bg-muted/20' : ''}
            `}
            onClick={() => isWorkoutStarted && onExerciseClick(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Dumbbell className="w-5 h-5 text-primary" />
                  )}
                </div>
                <span className={`${isCompleted ? 'text-muted-foreground' : ''}`}>
                  {exercise}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};