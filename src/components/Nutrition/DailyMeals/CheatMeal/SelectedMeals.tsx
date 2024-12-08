import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

interface SelectedMealsProps {
  meals: any[];
  onRemoveMeal: (meal: any) => void;
}

export const SelectedMeals = ({ meals, onRemoveMeal }: SelectedMealsProps) => {
  const getTotalCalories = () => {
    return meals.reduce((sum, meal) => sum + meal.calories, 0);
  };

  const getTotalProteins = () => {
    return meals.reduce((sum, meal) => sum + meal.proteins, 0);
  };

  if (meals.length === 0) return null;

  return (
    <div className="space-y-2 pt-2 border-t">
      <div className="font-medium">Sélection ({meals.length})</div>
      <div className="flex flex-wrap gap-2">
        {meals.map((meal) => (
          <Badge
            key={meal.id}
            variant="secondary"
            className="flex items-center gap-1 text-xs sm:text-sm"
          >
            {meal.name}
            <Trash2
              className="w-3 h-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveMeal(meal);
              }}
            />
          </Badge>
        ))}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground">
        Total: {getTotalCalories()} kcal • {getTotalProteins()}g protéines
      </div>
    </div>
  );
};