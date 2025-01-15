import { Input } from "@/components/ui/input";

interface WeightInputProps {
  weight: number;
  onWeightChange: (value: number) => void;
  onComplete?: () => void;
  disabled?: boolean;
}

export const WeightInput = ({ weight, onWeightChange, disabled = false }: WeightInputProps) => {
  const handleWeightChange = (value: number) => {
    // Ensure the weight is not negative
    const newWeight = Math.max(0, value);
    onWeightChange(newWeight);
  };

  return (
    <div className="flex flex-col flex-1">
      <Input
        type="number"
        value={weight}
        onChange={(e) => handleWeightChange(Number(e.target.value))}
        className="h-8 text-center text-sm px-2"
        disabled={disabled}
        min={0}
      />
    </div>
  );
};