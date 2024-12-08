import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface NutritionGoal {
  name: string;
  current: number;
  target: number;
  unit: string;
}

export const NutritionGoals = () => {
  const goals: NutritionGoal[] = [
    { name: "Calories", current: 1850, target: 2000, unit: "kcal" },
    { name: "Protéines", current: 120, target: 150, unit: "g" },
    { name: "Glucides", current: 200, target: 250, unit: "g" },
    { name: "Lipides", current: 65, target: 70, unit: "g" },
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