import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

interface SetCardProps {
  index: number;
  currentSet: number;
  isResting: boolean;
  reps: number;
  weight: number;
  onRepsChange: (value: number) => void;
  onWeightChange: (value: number) => void;
  onSetComplete: () => void;
}

export const SetCard = ({
  index,
  currentSet,
  isResting,
  reps,
  weight,
  onRepsChange,
  onWeightChange,
  onSetComplete,
}: SetCardProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        size="sm"
        className="w-12 h-12 rounded-full"
        onClick={onSetComplete}
        disabled={index + 1 !== currentSet || isResting}
      >
        <Check className="h-6 w-6" />
      </Button>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Répétitions</label>
          <Input
            type="number"
            value={reps}
            onChange={(e) => onRepsChange(Number(e.target.value))}
            className="text-center"
            disabled={index + 1 !== currentSet || isResting}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Charge (kg)</label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => onWeightChange(Number(e.target.value))}
            className="text-center"
            disabled={index + 1 !== currentSet || isResting}
          />
        </div>
      </div>
    </div>
  );
};