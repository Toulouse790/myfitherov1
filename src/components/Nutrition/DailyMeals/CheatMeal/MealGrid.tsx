import { Plus } from "lucide-react";

interface MealGridProps {
  meals: any[];
  selectedMeals: any[];
  onToggleMeal: (meal: any) => void;
}

export const MealGrid = ({ meals, selectedMeals, onToggleMeal }: MealGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-1">
      {meals.map((meal) => (
        <div
          key={meal.id}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedMeals.some(m => m.id === meal.id)
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted'
          }`}
          onClick={() => onToggleMeal(meal)}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium text-sm sm:text-base">{meal.name}</div>
              <div className="text-xs sm:text-sm opacity-90">
                {meal.calories} kcal • {meal.proteins}g protéines
              </div>
            </div>
            {selectedMeals.some(m => m.id === meal.id) && (
              <Plus className="w-4 h-4" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};