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
    <Card>
      <CardHeader>
        <CardTitle>Objectifs journaliers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{goal.name}</span>
                <span className="text-muted-foreground">
                  {goal.current}/{goal.target} {goal.unit}
                </span>
              </div>
              <Progress
                value={(goal.current / goal.target) * 100}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};