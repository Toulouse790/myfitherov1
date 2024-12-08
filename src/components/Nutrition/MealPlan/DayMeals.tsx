import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Meal, MealWithTitle } from "@/data/meals/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DayMealsProps {
  meals: Record<string, Meal>;
  mealTitles: Record<string, MealWithTitle>;
  isTrainingDay?: boolean;
  workoutTime?: 'morning' | 'evening';
  totalCarbs: number;
  carbsTarget: number;
  hasMorningSnack?: boolean;
  hasAfternoonSnack?: boolean;
}

export const DayMeals = ({ 
  meals = {}, // Add default empty object
  mealTitles, 
  isTrainingDay, 
  workoutTime,
  totalCarbs = 0, // Add default value
  carbsTarget = 0, // Add default value
  hasMorningSnack = true,
  hasAfternoonSnack = true
}: DayMealsProps) => {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  console.log("DayMeals - Received props:", {
    meals,
    mealTitles,
    isTrainingDay,
    workoutTime,
    totalCarbs,
    carbsTarget
  });

  const toggleMeal = (mealType: string) => {
    setExpandedMeal(expandedMeal === mealType ? null : mealType);
  };

  const getCarbsStatus = () => {
    const difference = totalCarbs - carbsTarget;
    if (Math.abs(difference) <= 20) return "optimal";
    return difference > 0 ? "high" : "low";
  };

  const getCarbsMessage = () => {
    if (!isTrainingDay) return "Jour de repos";
    return workoutTime === 'morning' 
      ? "Entraînement le matin - Glucides concentrés avant/après l'effort"
      : "Entraînement le soir - Glucides répartis dans la journée";
  };

  const carbsStatus = getCarbsStatus();

  // Filter out snacks based on preferences
  const filteredMealTitles = Object.entries(mealTitles || {}).reduce((acc, [key, value]) => {
    if (key === 'morning_snack' && !hasMorningSnack) return acc;
    if (key === 'afternoon_snack' && !hasAfternoonSnack) return acc;
    acc[key] = value;
    return acc;
  }, {} as Record<string, MealWithTitle>);

  return (
    <div className="space-y-4">
      <Alert variant={carbsStatus === "optimal" ? "default" : "destructive"}>
        <AlertDescription>
          {getCarbsMessage()} - 
          Glucides : {totalCarbs}g / {carbsTarget}g recommandés
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        {Object.entries(filteredMealTitles).map(([mealType, { title }]) => {
          console.log("Rendering meal:", mealType, "with data:", meals[mealType]);
          
          return (
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
                      {meals[mealType].calories} kcal | {meals[mealType].proteins}g protéines | 
                      <span className="font-medium"> {meals[mealType].carbs}g glucides </span> | 
                      {meals[mealType].fats}g lipides
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
          );
        })}
      </div>
    </div>
  );
};