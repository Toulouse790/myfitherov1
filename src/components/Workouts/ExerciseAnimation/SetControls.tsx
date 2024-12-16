import { Input } from "@/components/ui/input";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={weight}
          onChange={(e) => onWeightChange(Number(e.target.value))}
          className="w-24"
          disabled={disabled}
          min={0}
        />
        <span className="text-sm text-muted-foreground">kg</span>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={reps}
          onChange={(e) => onRepsChange(Number(e.target.value))}
          className="w-24"
          disabled={disabled}
          min={1}
        />
        <span className="text-sm text-muted-foreground">reps</span>
      </div>
    </div>
  );
};