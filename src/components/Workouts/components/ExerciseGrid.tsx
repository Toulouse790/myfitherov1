import { Card } from "@/components/ui/card";

interface ExerciseGridProps {
  exercises: string[];
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
      {exercises.map((exerciseName) => (
        <Card
          key={exerciseName}
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedExercises.includes(exerciseName) ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onExerciseToggle(exerciseName)}
        >
          <div className="space-y-2">
            <h3 className="font-medium">{exerciseName}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
};