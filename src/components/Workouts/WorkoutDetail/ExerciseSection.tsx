import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ExerciseSets } from "../ExerciseSets";

interface ExerciseSectionProps {
  exerciseName: string;
  onAddSet: () => void;
  onExerciseComplete: () => void;
  sessionId?: string;
}

export const ExerciseSection = ({ 
  exerciseName, 
  onAddSet, 
  onExerciseComplete,
  sessionId 
}: ExerciseSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{exerciseName}</h2>
        <Button
          variant="outline"
          onClick={onAddSet}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter une série
        </Button>
      </div>

      <ExerciseSets
        exerciseId={sessionId || ''}
        exerciseName={exerciseName}
        onComplete={async (exerciseId, exerciseName, difficulty, notes, calories) => {
          onExerciseComplete();
        }}
      />
    </div>
  );
};