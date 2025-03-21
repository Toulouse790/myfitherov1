
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

interface SetControlsProps {
  weight: number;
  reps: number;
  onWeightChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  disabled?: boolean;
}

export const SetControls = ({
  weight,
  reps,
  onWeightChange,
  onRepsChange,
  disabled = false
}: SetControlsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Poids (kg)</label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onWeightChange(Math.max(0, weight - 2.5))}
            disabled={disabled}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={weight}
            onChange={(e) => onWeightChange(Number(e.target.value))}
            className="text-center"
            disabled={disabled}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => onWeightChange(weight + 2.5)}
            disabled={disabled}
          >
            <Plus className="h-4 w-4" />
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
            disabled={disabled}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={reps}
            onChange={(e) => onRepsChange(Number(e.target.value))}
            className="text-center"
            disabled={disabled}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRepsChange(reps + 1)}
            disabled={disabled}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
