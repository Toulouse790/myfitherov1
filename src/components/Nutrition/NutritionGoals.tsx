import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
    <Card className="w-full sm:w-auto">
      <CardHeader className="p-3">
        <CardTitle className="text-sm sm:text-base">Objectifs journaliers</CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {goals.map((goal) => (
          <div key={goal.name} className="space-y-1">
            <div className="flex justify-between text-xs sm:text-sm">
              <span>{goal.name}</span>
              <span className="text-muted-foreground">
                {goal.current}/{goal.target} {goal.unit}
              </span>
            </div>
            <Progress
              value={(goal.current / goal.target) * 100}
              className="h-1.5"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};