import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodEntry } from "@/types/food";

interface MealSectionProps {
  type: string;
  label: string;
  mealEntries: FoodEntry[];
  generatedMeal: any;
  isExpanded: boolean;
  onToggle: () => void;
}

export const MealSection = ({
  type,
  label,
  mealEntries,
  generatedMeal,
  isExpanded,
  onToggle,
}: MealSectionProps) => {
  const calculateTotals = (entries: FoodEntry[]) => {
    return entries.reduce(
      (totals, entry) => ({
        calories: totals.calories + entry.calories,
        proteins: totals.proteins + entry.proteins,
      }),
      { calories: 0, proteins: 0 }
    );
  };

  const totals = calculateTotals(mealEntries);
  const displayCalories = mealEntries.length > 0 
    ? totals.calories 
    : (generatedMeal?.calories || 0);
  const displayProteins = mealEntries.length > 0 
    ? totals.proteins 
    : (generatedMeal?.proteins || 0);

  return (
    <div className="mb-2">
      <Button
        variant="ghost"
        className="w-full justify-between p-4 h-auto"
        onClick={onToggle}
      >
        <div className="text-left">
          <div className="font-medium">{label}</div>
          {(mealEntries.length > 0 || generatedMeal) && (
            <div className="text-sm text-muted-foreground">
              {displayCalories} kcal • {displayProteins}g protéines
            </div>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isExpanded && (
        <div className="pl-4 pr-2 py-2 space-y-2">
          {mealEntries.length > 0 ? (
            mealEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-3 rounded-lg bg-muted/50"
              >
                <div className="font-medium">{entry.name}</div>
                <div className="text-sm text-muted-foreground">
                  {entry.calories} kcal • {entry.proteins}g protéines
                </div>
              </div>
            ))
          ) : generatedMeal ? (
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="font-medium">{generatedMeal.name}</div>
              <div className="text-sm text-muted-foreground">
                {generatedMeal.calories} kcal • {generatedMeal.proteins}g protéines
              </div>
              {generatedMeal.notes && (
                <div className="text-sm text-muted-foreground mt-1">
                  {generatedMeal.notes}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-2">
              Aucun aliment enregistré
            </div>
          )}
        </div>
      )}
    </div>
  );
};