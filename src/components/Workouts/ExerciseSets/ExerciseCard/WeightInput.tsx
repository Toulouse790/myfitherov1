import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface WeightInputProps {
  weight: number;
  onWeightChange: (value: number) => void;
  onComplete?: () => void;
}

export const WeightInput = ({ weight, onWeightChange, onComplete }: WeightInputProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onWeightChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium min-w-20">Poids (kg)</label>
        <div className="flex items-center gap-2 flex-1">
          <Input
            type="number"
            value={weight}
            onChange={handleInputChange}
            className="text-center max-w-24"
            min={0}
            step={2.5}
          />
          <span className="text-sm text-muted-foreground">kg</span>
        </div>
      </div>
      
      {onComplete && (
        <Button 
          onClick={onComplete}
          className="w-full"
          type="button"
        >
          <Check className="w-4 h-4 mr-2" />
          Valider la série
        </Button>
      )}
    </div>
  );
};