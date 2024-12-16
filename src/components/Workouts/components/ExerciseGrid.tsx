import { Card } from "@/components/ui/card";
import { Exercise } from "@/hooks/use-exercise-selection";

interface ExerciseGridProps {
  exercises: Exercise[];
  selectedExercises: string[];
  onExerciseToggle: (exerciseName: string) => void;
}

export const ExerciseGrid = ({
  exercises,
  selectedExercises,
  onExerciseToggle,
}: ExerciseGridProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {exercises.map((exercise) => (
        <Card
          key={exercise.id}
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedExercises.includes(exercise.name) ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onExerciseToggle(exercise.name)}
        >
          <div className="space-y-2">
            <h3 className="font-medium">{exercise.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {exercise.muscle_group}
            </p>
            {exercise.difficulty && (
              <div className="flex gap-2">
                {exercise.difficulty.map((diff) => (
                  <span
                    key={diff}
                    className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    {diff}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};