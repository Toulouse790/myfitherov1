import { getPreparationInstructions } from "./PreparationInstructions";

interface MealContentProps {
  meal: {
    name: string;
    calories: number;
    proteins: number;
    preparation?: string;
  };
}

export const MealContent = ({ meal }: MealContentProps) => {
  const preparation = getPreparationInstructions(meal.name);

  return (
    <div className="p-4 pt-0 space-y-4 text-sm">
      <div>
        <p className="font-medium">{meal.name}</p>
        <p className="text-muted-foreground">
          {meal.calories} kcal | {meal.proteins}g protéines
        </p>
        {preparation && preparation !== "Aucune instruction disponible" && (
          <p className="mt-2 text-sm text-muted-foreground italic">
            💡 {preparation}
          </p>
        )}
      </div>
    </div>
  );
};