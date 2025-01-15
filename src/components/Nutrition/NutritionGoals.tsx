import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useFoodEntries } from "@/hooks/use-food-entries";

export const NutritionGoals = () => {
  const { dailyTargets } = useDailyTargets();
  const { entriesByMealType } = useFoodEntries();

  // Calculate totals from today's entries only, excluding skipped meals
  const actualTotals = Object.values(entriesByMealType).flat().reduce(
    (acc, entry) => {
      // Skip entries marked as "skipped"
      if (entry.status === 'skipped') {
        return acc;
      }

      // Ensure we're working with numbers and not strings
      const calories = Number(entry.calories) || 0;
      const proteins = Number(entry.proteins) || 0;
      const carbs = Number(entry.carbs) || 0;
      const fats = Number(entry.fats) || 0;

      return {
        calories: acc.calories + calories,
        proteins: acc.proteins + proteins,
        carbs: acc.carbs + carbs,
        fats: acc.fats + fats,
      };
    },
    { calories: 0, proteins: 0, carbs: 0, fats: 0 }
  );

  const calculatePercentage = (actual: number, target: number) => {
    if (!target) return 0;
    return Math.round((actual / target) * 100);
  };

  const goals = [
    { 
      name: "Calories", 
      actual: actualTotals.calories,
      target: dailyTargets.calories || 2000, 
      unit: "kcal" 
    },
    { 
      name: "Protéines", 
      actual: actualTotals.proteins,
      target: dailyTargets.proteins || 150, 
      unit: "g" 
    },
    { 
      name: "Glucides", 
      actual: actualTotals.carbs,
      target: Math.round((dailyTargets.calories || 2000) * 0.5 / 4), 
      unit: "g" 
    },
    { 
      name: "Lipides", 
      actual: actualTotals.fats,
      target: Math.round((dailyTargets.calories || 2000) * 0.3 / 9), 
      unit: "g" 
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-sm sm:text-base text-primary">Objectifs journaliers</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-3">
        {goals.map((goal) => (
          <div key={goal.name} className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span>{goal.name}</span>
              <div className="text-muted-foreground space-x-2">
                <span className={goal.actual > goal.target ? "text-red-500" : "text-green-500"}>
                  {goal.actual}
                </span>
                <span>/</span>
                <span>{goal.target} {goal.unit}</span>
                <span className="text-xs">
                  ({calculatePercentage(goal.actual, goal.target)}%)
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};