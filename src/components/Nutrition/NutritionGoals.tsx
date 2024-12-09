import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useFoodEntries } from "@/hooks/use-food-entries";

export const NutritionGoals = () => {
  const { dailyTargets } = useDailyTargets();
  const { entriesByMealType } = useFoodEntries();

  // Calculer les totaux réalisés des entrées du journal
  const actualTotals = Object.values(entriesByMealType).flat().reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      proteins: acc.proteins + entry.proteins,
    }),
    { calories: 0, proteins: 0 }
  );

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
      actual: Math.round((actualTotals.calories) * 0.5 / 4),
      target: Math.round((dailyTargets.calories || 2000) * 0.5 / 4), 
      unit: "g" 
    },
    { 
      name: "Lipides", 
      actual: Math.round((actualTotals.calories) * 0.3 / 9),
      target: Math.round((dailyTargets.calories || 2000) * 0.3 / 9), 
      unit: "g" 
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-sm sm:text-base">Objectifs journaliers</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-3">
        {goals.map((goal) => (
          <div key={goal.name} className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span>{goal.name}</span>
              <div className="text-muted-foreground space-x-2">
                <span className="text-green-500">{goal.actual}</span>
                <span>/</span>
                <span>{goal.target} {goal.unit}</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${Math.min((goal.actual / goal.target) * 100, 100)}%`,
                  backgroundColor: goal.actual >= goal.target ? '#22c55e' : '#0EA5E9'
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};