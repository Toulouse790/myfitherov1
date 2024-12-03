import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FoodEntryFormProps {
  newFood: string;
  calories: string;
  proteins: string;
  weight: string;
  baseCalories: number;
  onFoodChange: (value: string) => void;
  onCaloriesChange: (value: string) => void;
  onProteinsChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onAddEntry: () => void;
}

export const FoodEntryForm = ({
  newFood,
  calories,
  proteins,
  weight,
  baseCalories,
  onFoodChange,
  onCaloriesChange,
  onProteinsChange,
  onWeightChange,
  onAddEntry,
}: FoodEntryFormProps) => {
  const handleWeightChange = (value: string) => {
    onWeightChange(value);
    if (baseCalories > 0 && value) {
      // Calculate calories based on weight (baseCalories is per 100g)
      const newCalories = Math.round((baseCalories * parseInt(value)) / 100);
      onCaloriesChange(newCalories.toString());
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Input
        placeholder="Aliment"
        value={newFood}
        onChange={(e) => onFoodChange(e.target.value)}
        className="flex-1"
      />
      <Input
        type="number"
        placeholder="Poids (g)"
        value={weight}
        onChange={(e) => handleWeightChange(e.target.value)}
        className="w-24"
      />
      <Input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => onCaloriesChange(e.target.value)}
        className="w-24"
        readOnly
      />
      <Input
        type="number"
        placeholder="Protéines (g)"
        value={proteins}
        onChange={(e) => onProteinsChange(e.target.value)}
        className="w-24"
      />
      <Button onClick={onAddEntry} className="gap-2">
        <Plus className="w-4 h-4" /> Ajouter
      </Button>
    </div>
  );
};