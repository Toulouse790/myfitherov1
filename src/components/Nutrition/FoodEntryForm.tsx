import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MealTypeSelect } from "./FoodEntry/MealTypeSelect";
import { FoodInputs } from "./FoodEntry/FoodInputs";
import { ActionButtons } from "./FoodEntry/ActionButtons";

interface FoodEntryFormProps {
  newFood: string;
  calories: string;
  proteins: string;
  carbs: string;
  fats: string;
  weight: string;
  baseCalories: number;
  selectedCategory: string;
  onFoodChange: (value: string) => void;
  onCaloriesChange: (value: string) => void;
  onProteinsChange: (value: string) => void;
  onCarbsChange: (value: string) => void;
  onFatsChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onAddEntry: (mealType: string) => void;
}

export const FoodEntryForm = ({
  newFood,
  calories,
  proteins,
  carbs,
  fats,
  weight,
  baseCalories,
  selectedCategory,
  onFoodChange,
  onCaloriesChange,
  onProteinsChange,
  onCarbsChange,
  onFatsChange,
  onWeightChange,
  onAddEntry,
}: FoodEntryFormProps) => {
  const { toast } = useToast();
  const [selectedMealType, setSelectedMealType] = useState("");
  const [isCustomFood, setIsCustomFood] = useState(false);

  const handleWeightChange = (value: string) => {
    onWeightChange(value);
    if (baseCalories > 0 && value) {
      const newCalories = Math.round((baseCalories * parseInt(value)) / 100);
      onCaloriesChange(newCalories.toString());
    }
  };

  const handleAdd = () => {
    if (!selectedMealType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type de repas",
        variant: "destructive",
      });
      return;
    }
    onAddEntry(selectedMealType);
    setSelectedMealType("");
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-white border border-gray-200">
        <div className="flex flex-col gap-4">
          <MealTypeSelect 
            value={selectedMealType}
            onChange={setSelectedMealType}
          />

          <FoodInputs
            newFood={newFood}
            weight={weight}
            calories={calories}
            proteins={proteins}
            carbs={carbs}
            fats={fats}
            isCustomFood={isCustomFood}
            onFoodChange={onFoodChange}
            onWeightChange={handleWeightChange}
            onCaloriesChange={onCaloriesChange}
            onProteinsChange={onProteinsChange}
            onCarbsChange={onCarbsChange}
            onFatsChange={onFatsChange}
            setIsCustomFood={setIsCustomFood}
          />

          <ActionButtons onAdd={handleAdd} />
        </div>
      </Card>
    </div>
  );
};