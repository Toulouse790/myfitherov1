import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pizza } from "lucide-react";
import { mealTypes } from "./DailyMeals/MealTypes";
import { MealSection } from "./DailyMeals/MealSection";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useFoodEntries } from "@/hooks/use-food-entries";
import { CheatMealDialog } from "./DailyMeals/CheatMealDialog";

export const DailyMeals = () => {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [isCheatMealOpen, setIsCheatMealOpen] = useState(false);
  const { mealPlan } = useDailyTargets();
  const { entriesByMealType, refetchEntries } = useFoodEntries();

  const handleCheatMealDialogChange = (open: boolean) => {
    setIsCheatMealOpen(open);
    if (!open) {
      // Rafraîchir les entrées quand le dialog se ferme
      refetchEntries();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-3 sm:p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm sm:text-base">Repas du jour</CardTitle>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsCheatMealOpen(true)}>
          <Pizza className="w-4 h-4" />
          <span className="hidden sm:inline">Cheat Meal</span>
        </Button>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
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
      </CardContent>

      <CheatMealDialog 
        isOpen={isCheatMealOpen}
        onOpenChange={handleCheatMealDialogChange}
      />
    </Card>
  );
};