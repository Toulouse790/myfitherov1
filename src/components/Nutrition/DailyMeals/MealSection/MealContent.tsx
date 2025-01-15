import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { MealContentProps } from "./types";

export const MealContent = ({ mealEntries, generatedMeal, onMealStatus, type }: MealContentProps) => {
  const hasEntries = Array.isArray(mealEntries) && mealEntries.length > 0;

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
                    {entry.calories}cal | {entry.proteins}g protéines
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
    </div>
  );
};