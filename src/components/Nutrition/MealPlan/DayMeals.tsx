import { Card } from "@/components/ui/card";

interface Meal {
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  estimated_cost: number;
  is_cheat_meal?: boolean;
}

interface DayMealsProps {
  meals: Record<string, Meal>;
}

export const DayMeals = ({ meals }: DayMealsProps) => {
  return (
    <div className="space-y-4">
      {Object.entries(meals).map(([mealType, meal]) => (
        <div key={mealType} className="p-4 rounded-lg bg-muted">
          <h3 className="font-medium capitalize mb-2">{mealType}</h3>
          <div className="space-y-1 text-sm">
            <p>{meal.name}</p>
            <p className="text-muted-foreground">
              {meal.calories} kcal | {meal.proteins}g protéines | {meal.carbs}g glucides | {meal.fats}g lipides
            </p>
            <p className="text-primary">Coût estimé: {meal.estimated_cost}€</p>
            {meal.is_cheat_meal && (
              <p className="text-primary font-medium">Cheat meal 🎉</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};