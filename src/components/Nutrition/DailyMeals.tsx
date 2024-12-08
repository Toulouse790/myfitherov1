import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mealTypes } from "./DailyMeals/MealTypes";
import { MealSection } from "./DailyMeals/MealSection";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useFoodEntries } from "@/hooks/use-food-entries";

export const DailyMeals = () => {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const { mealPlan } = useDailyTargets();
  const { entriesByMealType } = useFoodEntries();

  return (
    <Card className="w-full">
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-sm sm:text-base">Repas du jour</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <ScrollArea className="h-[300px] sm:h-[400px] pr-2 sm:pr-4">
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(mealTypes).map(([type, label]) => (
              <MealSection
                key={type}
                type={type}
                label={label}
                mealEntries={entriesByMealType[type] || []}
                generatedMeal={{
                  name: "Suggestion basée sur vos objectifs",
                  calories: mealPlan[type]?.calories || 0,
                  proteins: mealPlan[type]?.proteins || 0,
                  notes: `Objectif: ${mealPlan[type]?.calories || 0} kcal, ${mealPlan[type]?.proteins || 0}g protéines`
                }}
                isExpanded={expandedMeal === type}
                onToggle={() => setExpandedMeal(expandedMeal === type ? null : type)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};