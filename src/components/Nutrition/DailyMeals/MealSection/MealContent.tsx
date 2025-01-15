import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { MealContentProps } from "./types";

export const MealContent = ({ mealEntries, generatedMeal, onMealStatus, type }: MealContentProps) => {
  const hasEntries = mealEntries && mealEntries.length > 0;

  return (
    <div className="space-y-4 p-4">
      {hasEntries ? (
        <div className="space-y-2">
          {mealEntries.map((entry) => (
            <Card key={entry.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{entry.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {entry.calories} kcal | {entry.proteins}g protéines
                    {entry.carbs > 0 && ` | ${entry.carbs}g glucides`}
                    {entry.fats > 0 && ` | ${entry.fats}g lipides`}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>Aucun aliment ajouté</p>
        </div>
      )}

      {generatedMeal && !hasEntries && (
        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMealStatus('taken')}
            className="flex items-center gap-1"
          >
            <Check className="w-4 h-4" />
            Valider
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMealStatus('skipped')}
            className="flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Sauter
          </Button>
        </div>
      )}
    </div>
  );
};