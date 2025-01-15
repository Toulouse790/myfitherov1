import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealContentProps } from "./types";
import { useDailyTargets } from "@/hooks/use-daily-targets";

export const MealContent = ({ mealEntries, generatedMeal, onMealStatus }: MealContentProps) => {
  const { dailyTargets } = useDailyTargets();

  const calculatePercentage = (value: number, target: number) => {
    if (!target) return 0;
    return Math.round((value / target) * 100);
  };

  return (
    <div className="pl-4 pr-2 py-2 space-y-2">
      {mealEntries.length > 0 ? (
        mealEntries.map((entry) => (
          <div
            key={entry.id}
            className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-colors"
          >
            <div className="font-medium text-gray-800">{entry.name}</div>
            <div className="text-sm text-muted-foreground">
              {entry.calories} kcal ({calculatePercentage(entry.calories, dailyTargets.calories)}% des besoins) | {entry.proteins}g protéines ({calculatePercentage(entry.proteins, dailyTargets.proteins)}% des besoins)
              {entry.carbs !== undefined && ` | ${entry.carbs}g glucides`}
              {entry.fats !== undefined && ` | ${entry.fats}g lipides`}
            </div>
            {entry.notes && (
              <p className="mt-2 text-sm text-muted-foreground italic">
                {entry.notes}
              </p>
            )}
          </div>
        ))
      ) : generatedMeal ? (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-gray-50">
            <div className="font-medium text-gray-800">{generatedMeal.name}</div>
            <div className="text-sm text-muted-foreground">
              {generatedMeal.calories} kcal ({calculatePercentage(generatedMeal.calories, dailyTargets.calories)}% des besoins) | {generatedMeal.proteins}g protéines ({calculatePercentage(generatedMeal.proteins, dailyTargets.proteins)}% des besoins)
              {generatedMeal.carbs !== undefined && ` | ${generatedMeal.carbs}g glucides`}
              {generatedMeal.fats !== undefined && ` | ${generatedMeal.fats}g lipides`}
            </div>
            {generatedMeal.quantities && generatedMeal.quantities.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium text-gray-700">Ingrédients :</p>
                <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                  {generatedMeal.quantities.map((item, index) => (
                    <li key={index}>
                      {item.item}: {item.amount}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMealStatus('skipped')}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMealStatus('taken')}
              className="text-green-500 hover:text-green-600 hover:bg-green-50"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-2">
          Aucun repas suggéré
        </div>
      )}
    </div>
  );
};