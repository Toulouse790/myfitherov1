
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { FoodEntry } from "@/types/food";

interface MealContentProps {
  mealEntries: FoodEntry[];
  onAddFood?: () => void;
  type: string;
}

export const MealContent = ({ mealEntries, onAddFood, type }: MealContentProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4 p-3">
      {mealEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground mb-4">
            {t("nutrition.noMealsAdded")}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={onAddFood}
          >
            <Plus className="h-4 w-4" />
            {t("nutrition.addFood")}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {mealEntries.map((entry) => (
            <div 
              key={entry.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <h4 className="font-medium">{entry.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {entry.calories} kcal | {entry.proteins}g {t("nutrition.proteins")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
