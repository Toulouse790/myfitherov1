import { Input } from "@/components/ui/input";

interface WeightInputProps {
  weight: number;
  onWeightChange: (value: number) => void;
  onComplete?: () => void;
  disabled?: boolean;
}

export const WeightInput = ({ weight, onWeightChange, disabled = false }: WeightInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium min-w-16">Poids (kg)</label>
      <div className="flex items-center gap-2 flex-1">
        <Input
          type="number"
          value={weight}
          onChange={(e) => onWeightChange(Number(e.target.value))}
          className="text-center max-w-16 h-8 text-sm"
          disabled={disabled}
        />
      </div>
    </div>
  );
};