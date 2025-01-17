import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { commonFoods } from "@/data/commonFoods";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FoodInputsProps {
  newFood: string;
  weight: string;
  calories: string;
  proteins: string;
  carbs: string;
  fats: string;
  notes: string;
  isCustomFood: boolean;
  isCompositeMeal: boolean;
  ingredients: Array<{ name: string; portion: string }>;
  onFoodChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onCaloriesChange: (value: string) => void;
  onProteinsChange: (value: string) => void;
  onCarbsChange: (value: string) => void;
  onFatsChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onIsCompositeMealChange: (value: boolean) => void;
  onIngredientsChange: (value: Array<{ name: string; portion: string }>) => void;
  setIsCustomFood: (value: boolean) => void;
}

export const FoodInputs = ({
  newFood,
  weight,
  calories,
  proteins,
  carbs,
  fats,
  notes,
  isCustomFood,
  isCompositeMeal,
  ingredients,
  onFoodChange,
  onWeightChange,
  onCaloriesChange,
  onProteinsChange,
  onCarbsChange,
  onFatsChange,
  onNotesChange,
  onIsCompositeMealChange,
  onIngredientsChange,
  setIsCustomFood,
}: FoodInputsProps) => {
  const handleFoodChange = (value: string) => {
    onFoodChange(value);
    const selectedFood = commonFoods.find(
      (food) => food.name.toLowerCase().includes(value.toLowerCase())
    );

    if (selectedFood) {
      setIsCustomFood(false);
      onCaloriesChange(selectedFood.calories.toString());
      onProteinsChange(selectedFood.proteins.toString());
      onCarbsChange(selectedFood.carbs.toString());
      onFatsChange(selectedFood.fats.toString());
    } else {
      setIsCustomFood(true);
    }
  };

  const foodSuggestions = commonFoods
    .filter((food) => 
      food.name.toLowerCase().includes(newFood.toLowerCase())
    )
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Aliment</label>
          <div className="relative">
            <Input
              placeholder="Nom de l'aliment"
              value={newFood}
              onChange={(e) => handleFoodChange(e.target.value)}
              className="w-full"
              list="food-suggestions"
            />
            <datalist id="food-suggestions">
              {foodSuggestions.map((food) => (
                <option key={food.id} value={food.name} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Poids (g)</label>
          <Input
            type="number"
            placeholder="Poids en grammes"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Calories</label>
          <Input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => onCaloriesChange(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Protéines (g)</label>
          <Input
            type="number"
            placeholder="Protéines"
            value={proteins}
            onChange={(e) => onProteinsChange(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Glucides (g)</label>
          <Input
            type="number"
            placeholder="Glucides"
            value={carbs}
            onChange={(e) => onCarbsChange(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes (optionnel)</label>
        <Textarea
          placeholder="Ajoutez des notes sur votre repas..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-[100px] w-full"
        />
      </div>
    </div>
  );
};