import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useFoodEntries } from "@/hooks/use-food-entries";

export const NutritionGoals = () => {
  const { dailyTargets } = useDailyTargets();
  const { entriesByMealType } = useFoodEntries();

  // Calculate total nutrients from all food entries
  const totals = Object.values(entriesByMealType).flat().reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      proteins: acc.proteins + entry.proteins,
    }),
    { calories: 0, proteins: 0 }
  );

  const goals = [
    { 
      name: "Calories", 
      current: totals.calories, 
      target: dailyTargets.calories || 2000, 
      unit: "kcal" 
    },
    { 
      name: "Protéines", 
      current: totals.proteins, 
      target: dailyTargets.proteins || 150, 
      unit: "g" 
    },
    { 
      name: "Glucides", 
      current: Math.round((totals.calories) * 0.5 / 4), // 50% des calories en glucides
      target: Math.round((dailyTargets.calories || 2000) * 0.5 / 4), 
      unit: "g" 
    },
    { 
      name: "Lipides", 
      current: Math.round((totals.calories) * 0.3 / 9), // 30% des calories en lipides
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
              <span className="text-muted-foreground">
                {goal.current}/{goal.target} {goal.unit}
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="relative w-full h-full">
                <div
                  className="absolute top-0 left-0 h-full bg-muted-foreground/20"
                  style={{ width: '100%' }}
                />
                <div
                  className="absolute top-0 left-0 h-full transition-all duration-500"
                  style={{
                    width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                    backgroundColor: goal.current >= goal.target ? '#22c55e' : '#0EA5E9'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};