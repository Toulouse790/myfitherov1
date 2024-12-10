import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExerciseHeaderProps {
  exerciseName: string;
  onAddSet: () => void;
}

export const ExerciseHeader = ({ exerciseName, onAddSet }: ExerciseHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">{exerciseName}</h2>
      <Button
        variant="outline"
        size="sm"
        onClick={onAddSet}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Ajouter une série
      </Button>
    </div>
  );
};