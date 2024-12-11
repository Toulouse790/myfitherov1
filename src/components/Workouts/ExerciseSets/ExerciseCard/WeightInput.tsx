import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown } from "lucide-react";

interface WeightInputProps {
  weight: number;
  onWeightChange: (value: number) => void;
}

export const WeightInput = ({ weight, onWeightChange }: WeightInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Poids (kg)</label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onWeightChange(weight - 2.5)}
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
  );
};