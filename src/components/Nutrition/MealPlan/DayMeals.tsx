import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Meal, MealWithTitle } from "@/data/meals/types";

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
            <div className="p-4 pt-0 space-y-4 text-sm">
              <div>
                <p className="font-medium">{meals[mealType].name}</p>
                <p className="text-muted-foreground">
                  {meals[mealType].calories} kcal | {meals[mealType].proteins}g protéines | {meals[mealType].carbs}g glucides | {meals[mealType].fats}g lipides
                </p>
                <p className="text-primary">Coût estimé: {meals[mealType].estimated_cost}€</p>
              </div>

              {meals[mealType].quantities && (
                <div className="space-y-2">
                  <p className="font-medium">Ingrédients:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {meals[mealType].quantities.map((q, idx) => (
                      <li key={idx}>
                        {q.item}: {q.amount}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {meals[mealType].notes && (
                <div className="space-y-1">
                  <p className="font-medium">Préparation:</p>
                  <p className="text-muted-foreground">{meals[mealType].notes}</p>
                </div>
              )}

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