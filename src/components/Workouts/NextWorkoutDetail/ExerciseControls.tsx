import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ExerciseControlsProps {
  weight: number;
  reps: number;
  onWeightChange: (value: number) => void;
  onRepsChange: (value: number) => void;
}

export const ExerciseControls = ({
  weight,
  reps,
  onWeightChange,
  onRepsChange
}: ExerciseControlsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Poids (kg)</label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onWeightChange(Math.max(0, weight - 2.5))}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={weight}
            onChange={(e) => onWeightChange(Number(e.target.value))}
            className="text-center"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => onWeightChange(weight + 2.5)}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Répétitions</label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRepsChange(Math.max(1, reps - 1))}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={reps}
            onChange={(e) => onRepsChange(Number(e.target.value))}
            className="text-center"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRepsChange(reps + 1)}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};