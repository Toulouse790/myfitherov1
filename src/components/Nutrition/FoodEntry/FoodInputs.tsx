import { Input } from "@/components/ui/input";
import { commonFoods } from "@/data/commonFoods";

interface FoodInputsProps {
  newFood: string;
  weight: string;
  calories: string;
  proteins: string;
  carbs: string;
  fats: string;
  isCustomFood: boolean;
  onFoodChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onCaloriesChange: (value: string) => void;
  onProteinsChange: (value: string) => void;
  onCarbsChange: (value: string) => void;
  onFatsChange: (value: string) => void;
  setIsCustomFood: (value: boolean) => void;
}

export const FoodInputs = ({
  newFood,
  weight,
  calories,
  proteins,
  carbs,
  fats,
  isCustomFood,
  onFoodChange,
  onWeightChange,
  onCaloriesChange,
  onProteinsChange,
  onCarbsChange,
  onFatsChange,
  setIsCustomFood,
}: FoodInputsProps) => {
  const handleFoodChange = (value: string) => {
    onFoodChange(value);
    setIsCustomFood(true);
    
    const selectedFood = commonFoods.find(food => food.name === value);
    if (selectedFood && weight) {
      updateNutrients(selectedFood.calories, selectedFood.proteins, selectedFood.carbs || 0, selectedFood.fats || 0, weight);
    }
  };

  const handleWeightChange = (newWeight: string) => {
    onWeightChange(newWeight);
    
    const selectedFood = commonFoods.find(food => food.name === newFood);
    if (selectedFood && newWeight) {
      updateNutrients(selectedFood.calories, selectedFood.proteins, selectedFood.carbs || 0, selectedFood.fats || 0, newWeight);
    }
  };

  const updateNutrients = (baseCalories: number, baseProteins: number, baseCarbs: number, baseFats: number, currentWeight: string) => {
    const weightNum = parseFloat(currentWeight);
    if (!isNaN(weightNum)) {
      const newCalories = Math.round((baseCalories * weightNum) / 100);
      const newProteins = Math.round((baseProteins * weightNum) / 100);
      const newCarbs = Math.round((baseCarbs * weightNum) / 100);
      const newFats = Math.round((baseFats * weightNum) / 100);
      onCaloriesChange(newCalories.toString());
      onProteinsChange(newProteins.toString());
      onCarbsChange(newCarbs.toString());
      onFatsChange(newFats.toString());
    }
  };

  const selectedFood = commonFoods.find(food => food.name === newFood);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Nom de l'aliment"
              value={newFood}
              onChange={(e) => handleFoodChange(e.target.value)}
              className="bg-white"
              list="food-suggestions"
            />
            <datalist id="food-suggestions" className="hidden">
              {commonFoods.map((food) => (
                <option key={food.id} value={food.name} />
              ))}
            </datalist>
          </div>

          <Input
            type="number"
            placeholder="Quantité (g)"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => onCaloriesChange(e.target.value)}
            className={isCustomFood ? "bg-white" : "bg-gray-50"}
            readOnly={!isCustomFood}
          />
          <Input
            type="number"
            placeholder="Protéines (g)"
            value={proteins}
            onChange={(e) => onProteinsChange(e.target.value)}
            className={isCustomFood ? "bg-white" : "bg-gray-50"}
            readOnly={!isCustomFood}
          />
          <Input
            type="number"
            placeholder="Glucides (g)"
            value={carbs}
            onChange={(e) => onCarbsChange(e.target.value)}
            className={isCustomFood ? "bg-white" : "bg-gray-50"}
            readOnly={!isCustomFood}
          />
          <Input
            type="number"
            placeholder="Lipides (g)"
            value={fats}
            onChange={(e) => onFatsChange(e.target.value)}
            className={isCustomFood ? "bg-white" : "bg-gray-50"}
            readOnly={!isCustomFood}
          />
        </div>
      </div>

      {selectedFood?.description && (
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="italic">💡 {selectedFood.description}</p>
        </div>
      )}
    </div>
  );
};
