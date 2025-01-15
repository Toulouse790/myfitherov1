import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDailyTargets } from "@/hooks/use-daily-targets";

export const NutritionGoals = () => {
  const { consumedNutrients } = useDailyTargets();

  const consumed = consumedNutrients || {
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Repas du jour</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Calories</span>
            <span>{consumed.calories} cal</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Protéines</span>
            <span>{consumed.proteins}g</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Glucides</span>
            <span>{consumed.carbs}g</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Lipides</span>
            <span>{consumed.fats}g</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};