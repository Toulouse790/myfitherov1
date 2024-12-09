import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MealContent } from "./MealContent";

interface DayMealsProps {
  meals: Record<string, any>;
  mealTitles: Record<string, any>;
  isTrainingDay?: boolean;
  workoutTime?: 'morning' | 'evening';
  totalCarbs?: number;
  carbsTarget?: number;
  hasMorningSnack?: boolean;
  hasAfternoonSnack?: boolean;
}

export const DayMeals = ({ 
  meals = {}, 
  mealTitles, 
  isTrainingDay = false,
  workoutTime,
  totalCarbs = 0,
  carbsTarget = 0,
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

  // Filtrer les types de repas selon les préférences
  const filteredMealTitles = Object.entries(mealTitles).reduce((acc, [key, value]) => {
    if (key === 'morning_snack' && !hasMorningSnack) return acc;
    if (key === 'afternoon_snack' && !hasAfternoonSnack) return acc;
    acc[key] = value;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-4">
      <Alert variant={getCarbsStatus() === "optimal" ? "default" : "destructive"}>
        <AlertDescription>
          {getCarbsMessage()} - 
          Glucides : {totalCarbs}g / {carbsTarget}g recommandés
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        {Object.entries(filteredMealTitles).map(([mealType, { title }]) => {
          const meal = meals[mealType];
          console.log(`Rendering meal ${mealType}:`, meal);

          if (!meal) return null;

          return (
            <Card key={mealType} className="overflow-hidden">
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center p-4 h-auto"
                onClick={() => setExpandedMeal(expandedMeal === mealType ? null : mealType)}
              >
                <span className="font-medium">{title}</span>
                {expandedMeal === mealType ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {expandedMeal === mealType && (
                <MealContent meal={meal} />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};