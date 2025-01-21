import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDailyTargets } from "@/hooks/use-daily-targets";

export const NutritionGoals = () => {
  const { dailyTargets, consumedNutrients } = useDailyTargets();

  const calculateProgress = (consumed: number = 0, target: number = 0) => {
    if (!target) return 0;
    return Math.min(Math.round((consumed / target) * 100), 100);
  };

  const consumed = consumedNutrients || {
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0
  };

  const targets = dailyTargets || {
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0
  };

  return (
    <Card className="p-4 sm:p-6 bg-[#F1F0FB] border border-[#D6BCFA]/20 rounded-xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Balance énergétique</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Calories</span>
            <span>{consumed.calories} / {targets.calories} cal</span>
          </div>
          <Progress value={calculateProgress(consumed.calories, targets.calories)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Protéines</span>
            <span>{consumed.proteins} / {targets.proteins}g</span>
          </div>
          <Progress value={calculateProgress(consumed.proteins, targets.proteins)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Glucides</span>
            <span>{consumed.carbs} / {targets.carbs}g</span>
          </div>
          <Progress value={calculateProgress(consumed.carbs, targets.carbs)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Lipides</span>
            <span>{consumed.fats} / {targets.fats}g</span>
          </div>
          <Progress value={calculateProgress(consumed.fats, targets.fats)} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};