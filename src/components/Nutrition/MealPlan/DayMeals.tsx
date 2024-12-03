import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  const toggleMeal = (mealType: string) => {
    setExpandedMeal(expandedMeal === mealType ? null : mealType);
  };

  return (
    <div className="space-y-2">
      {Object.entries(mealTitles).map(([mealType, { title }]) => (
        <Card key={mealType} className="overflow-hidden">
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4 h-auto"
            onClick={() => toggleMeal(mealType)}
          >
            <span className="font-medium">{title}</span>
            {expandedMeal === mealType ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          {expandedMeal === mealType && meals[mealType] && (
            <div className="p-4 pt-0 space-y-2 text-sm">
              <p className="font-medium">{meals[mealType].name}</p>
              <p className="text-muted-foreground">
                {meals[mealType].calories} kcal | {meals[mealType].proteins}g protéines | {meals[mealType].carbs}g glucides | {meals[mealType].fats}g lipides
              </p>
              <p className="text-primary">Coût estimé: {meals[mealType].estimated_cost}€</p>
              {meals[mealType].is_cheat_meal && (
                <p className="text-primary font-medium">Cheat meal 🎉</p>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};