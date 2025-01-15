import { Input } from "@/components/ui/input";

interface WeightInputProps {
  weight: number;
  onWeightChange: (value: number) => void;
  disabled?: boolean;
}

export const WeightInput = ({ weight, onWeightChange, disabled = false }: WeightInputProps) => {
  const handleWeightChange = (value: number) => {
    if (disabled) return;
    onWeightChange(Math.max(0, value));
  };

  return (
    <div className="flex flex-col flex-1">
      <Input
        type="number"
        value={weight}
        onChange={(e) => handleWeightChange(Number(e.target.value))}
        className={`h-8 text-center text-sm px-2 ${disabled ? 'bg-muted cursor-not-allowed' : ''}`}
        disabled={disabled}
        min={0}
      />
    </div>
  );
};