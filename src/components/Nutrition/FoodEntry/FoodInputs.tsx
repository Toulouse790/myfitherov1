import { Input } from "@/components/ui/input";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="space-y-2">
        <Input
          placeholder="Nom de l'aliment"
          value={newFood}
          onChange={(e) => {
            onFoodChange(e.target.value);
            setIsCustomFood(true);
          }}
          className="bg-white border-gray-300"
        />
        <Input
          type="number"
          placeholder="Quantité (g)"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          className="bg-white border-gray-300"
        />
      </div>
      <div className="space-y-2">
        <Input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => onCaloriesChange(e.target.value)}
          className={`border-gray-300 ${isCustomFood ? 'bg-white' : 'bg-gray-50'}`}
          readOnly={!isCustomFood}
        />
        <Input
          type="number"
          placeholder="Protéines (g)"
          value={proteins}
          onChange={(e) => onProteinsChange(e.target.value)}
          className="bg-white border-gray-300"
        />
      </div>
    </div>
  );
};