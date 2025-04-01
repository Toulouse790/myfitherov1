
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MealTypeSelect } from "./MealTypeSelect";
import { FoodInputs } from "./FoodInputs";
import { ActionButtons } from "./ActionButtons";
import { useFoodValidation } from "@/hooks/food-journal/validation";

interface FoodEntryFormProps {
  newFood: string;
  calories: string;
  proteins: string;
  carbs: string;
  fats: string;
  weight: string;
  notes: string;
  baseCalories: number;
  selectedCategory: string;
  preselectedMealType?: string;
  onFoodChange: (value: string) => void;
  onCaloriesChange: (value: string) => void;
  onProteinsChange: (value: string) => void;
  onCarbsChange: (value: string) => void;
  onFatsChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onAddEntry: (mealType: string, isComposite?: boolean, ingredients?: Array<{ name: string; portion: string }>) => void;
}

export const FoodEntryForm = ({
  newFood,
  calories,
  proteins,
  carbs,
  fats,
  weight,
  notes,
  baseCalories,
  selectedCategory,
  preselectedMealType,
  onFoodChange,
  onCaloriesChange,
  onProteinsChange,
  onCarbsChange,
  onFatsChange,
  onWeightChange,
  onNotesChange,
  onAddEntry,
}: FoodEntryFormProps) => {
  const { toast } = useToast();
  const { validateNumericInput } = useFoodValidation();
  const [selectedMealType, setSelectedMealType] = useState(preselectedMealType || "");
  const [isCustomFood, setIsCustomFood] = useState(false);
  const [isCompositeMeal, setIsCompositeMeal] = useState(false);
  const [ingredients, setIngredients] = useState<Array<{ name: string; portion: string }>>([]);

  const handleAdd = () => {
    if (!selectedMealType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type de repas",
        variant: "destructive",
      });
      return;
    }

    if (isCompositeMeal) {
      if (ingredients.length === 0) {
        toast({
          title: "Erreur",
          description: "Veuillez ajouter au moins un ingrédient",
          variant: "destructive",
        });
        return;
      }
      onAddEntry(selectedMealType, true, ingredients);
    } else {
      if (!newFood || !calories || !proteins) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive",
        });
        return;
      }
      onAddEntry(selectedMealType);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-3">
        <div className="flex flex-col gap-4">
          {!preselectedMealType && (
            <MealTypeSelect 
              value={selectedMealType}
              onChange={setSelectedMealType}
            />
          )}

          <FoodInputs
            newFood={newFood}
            weight={weight}
            calories={calories}
            proteins={proteins}
            carbs={carbs}
            fats={fats}
            notes={notes}
            isCustomFood={isCustomFood}
            isCompositeMeal={isCompositeMeal}
            ingredients={ingredients}
            onFoodChange={onFoodChange}
            onWeightChange={onWeightChange}
            onCaloriesChange={onCaloriesChange}
            onProteinsChange={onProteinsChange}
            onCarbsChange={onCarbsChange}
            onFatsChange={onFatsChange}
            onNotesChange={onNotesChange}
            onIsCompositeMealChange={setIsCompositeMeal}
            onIngredientsChange={setIngredients}
            setIsCustomFood={setIsCustomFood}
          />

          <ActionButtons onAdd={handleAdd} />
        </div>
      </Card>
    </div>
  );
};
