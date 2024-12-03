import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

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
      const newCalories = Math.round((baseCalories * parseInt(value)) / 100);
      onCaloriesChange(newCalories.toString());
    }
  };

  return (
    <Card className="p-4 bg-white border border-gray-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Input
          placeholder="Aliment"
          value={newFood}
          onChange={(e) => onFoodChange(e.target.value)}
          className="col-span-2 md:col-span-1 bg-white border-gray-300"
        />
        <Input
          type="number"
          placeholder="Poids (g)"
          value={weight}
          onChange={(e) => handleWeightChange(e.target.value)}
          className="bg-white border-gray-300"
        />
        <Input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => onCaloriesChange(e.target.value)}
          className="bg-gray-50 border-gray-300"
          readOnly
        />
        <Input
          type="number"
          placeholder="Protéines (g)"
          value={proteins}
          onChange={(e) => onProteinsChange(e.target.value)}
          className="bg-white border-gray-300"
        />
        <Button 
          onClick={onAddEntry} 
          className="col-span-2 md:col-span-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>
    </Card>
  );
};