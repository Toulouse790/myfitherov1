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

interface MealWithTitle {
  title: string;
  meal: Meal;
}

interface DayMealsProps {
  meals: Record<string, Meal>;
  mealTitles: Record<string, MealWithTitle>;
}

export const DayMeals = ({ meals, mealTitles }: DayMealsProps) => {
  return (
    <div className="space-y-4">
      {Object.entries(mealTitles).map(([mealType, { title }]) => (
        <div key={mealType} className="p-4 rounded-lg bg-muted">
          <h3 className="font-medium mb-2">{title}</h3>
          {meals[mealType] && (
            <div className="space-y-1 text-sm">
              <p>{meals[mealType].name}</p>
              <p className="text-muted-foreground">
                {meals[mealType].calories} kcal | {meals[mealType].proteins}g protéines | {meals[mealType].carbs}g glucides | {meals[mealType].fats}g lipides
              </p>
              <p className="text-primary">Coût estimé: {meals[mealType].estimated_cost}€</p>
              {meals[mealType].is_cheat_meal && (
                <p className="text-primary font-medium">Cheat meal 🎉</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};