import { FoodItem } from "@/types/nutrition";
import { getPreparationInstructions } from "./PreparationInstructions";

interface FoodDetailsProps {
  food: FoodItem;
}

export const FoodDetails = ({ food }: FoodDetailsProps) => {
  return (
    <div>
      <p className="font-medium">{food.name}</p>
      <p className="text-sm text-muted-foreground">
        {food.calories} kcal | {food.proteins}g protéines
      </p>
      {food.quantities && food.quantities.length > 0 && (
        <div className="mt-1 text-sm text-muted-foreground">
          {food.quantities.map((q, idx) => (
            <p key={idx}>{q.item}: {q.amount}</p>
          ))}
        </div>
      )}
      <p className="mt-2 text-sm text-muted-foreground italic">
        💡 {getPreparationInstructions(food.name)}
      </p>
    </div>
  );
};