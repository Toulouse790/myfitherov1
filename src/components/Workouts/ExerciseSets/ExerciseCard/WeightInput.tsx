import { Input } from "@/components/ui/input";

interface WeightInputProps {
  weight: number;
  onWeightChange: (value: number) => void;
  onComplete?: () => void;
  disabled?: boolean;
}

export const WeightInput = ({ weight, onWeightChange, disabled = false }: WeightInputProps) => {
  return (
    <div className="flex flex-col flex-1">
      <span className="text-xs text-muted-foreground mb-1">kg</span>
      <Input
        type="number"
        value={weight}
        onChange={(e) => onWeightChange(Number(e.target.value))}
        className="h-8 text-center text-sm px-2"
        disabled={disabled}
      />
    </div>
  );
};