import { Input } from "@/components/ui/input";
import { commonFoods } from "@/data/commonFoods";

interface FoodInputsProps {
  newFood: string;
  weight: string;
  calories: string;
  proteins: string;
  isCustomFood: boolean;
  onFoodChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onCaloriesChange: (value: string) => void;
  onProteinsChange: (value: string) => void;
  setIsCustomFood: (value: boolean) => void;
}

export const FoodInputs = ({
  newFood,
  weight,
  calories,
  proteins,
  isCustomFood,
  onFoodChange,
  onWeightChange,
  onCaloriesChange,
  onProteinsChange,
  setIsCustomFood,
}: FoodInputsProps) => {
  const handleFoodChange = (value: string) => {
    onFoodChange(value);
    setIsCustomFood(true);
    
    const selectedFood = commonFoods.find(food => food.name === value);
    if (selectedFood && weight) {
      const weightNum = parseFloat(weight);
      if (!isNaN(weightNum)) {
        const newCalories = Math.round((selectedFood.calories * weightNum) / 100);
        const newProteins = Math.round((selectedFood.proteins * weightNum) / 100);
        onCaloriesChange(newCalories.toString());
        onProteinsChange(newProteins.toString());
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Nom de l'aliment"
          value={newFood}
          onChange={(e) => handleFoodChange(e.target.value)}
          className="bg-white"
        />

        <Input
          type="number"
          placeholder="Quantité (g)"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
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
      </div>
    </div>
  );
};