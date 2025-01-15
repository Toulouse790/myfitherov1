import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { MealContentProps } from "./types";

export const MealContent = ({ mealEntries, generatedMeal, onMealStatus, type }: MealContentProps) => {
  return (
    <div className="space-y-4 p-4">
      {Array.isArray(mealEntries) && mealEntries.length > 0 ? (
        <div className="space-y-2">
          {mealEntries.map((entry) => (
            <Card key={entry.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{entry.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {entry.calories}cal | {entry.proteins}g protéines
                    {typeof entry.carbs === 'number' && ` | ${entry.carbs}g glucides`}
                    {typeof entry.fats === 'number' && ` | ${entry.fats}g lipides`}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>Aucun aliment ajouté</p>
          {generatedMeal && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">{generatedMeal.name}</h4>
              <p className="text-sm">
                {generatedMeal.calories}cal | {generatedMeal.proteins}g protéines
              </p>
              {generatedMeal.quantities && (
                <div className="mt-2 text-sm">
                  {generatedMeal.quantities.map((q, idx) => (
                    <p key={idx}>{q.item}: {q.amount}</p>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-4 justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => onMealStatus('taken')}
                >
                  <Check className="w-4 h-4" />
                  Valider
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => onMealStatus('skipped')}
                >
                  <X className="w-4 h-4" />
                  Non pris
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};