import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown } from "lucide-react";

interface WeightInputProps {
  weight: number;
  onWeightChange: (value: number) => void;
}

export const WeightInput = ({ weight, onWeightChange }: WeightInputProps) => {
  const handleIncrement = () => {
    const newWeight = Math.round((weight + 2.5) * 10) / 10;
    onWeightChange(newWeight);
  };

  const handleDecrement = () => {
    const newWeight = Math.max(0, Math.round((weight - 2.5) * 10) / 10);
    onWeightChange(newWeight);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onWeightChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Poids (kg)</label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          type="button"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={weight}
          onChange={handleInputChange}
          className="text-center"
          min={0}
          step={2.5}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          type="button"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};