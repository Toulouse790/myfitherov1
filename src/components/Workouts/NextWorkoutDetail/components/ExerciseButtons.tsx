import { Button } from "@/components/ui/button";

interface ExerciseButtonsProps {
  exercises: string[];
  currentExerciseIndex: number | null;
  onExerciseSelect: (index: number) => void;
}

export const ExerciseButtons = ({
  exercises,
  currentExerciseIndex,
  onExerciseSelect,
}: ExerciseButtonsProps) => {
  return (
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
  );
};