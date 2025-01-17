import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ShoppingBag, X } from "lucide-react";
import { MealContentProps } from "./types";

export const MealContent = ({ 
  mealEntries, 
  generatedMeal, 
  onMealStatus,
  mealType 
}: MealContentProps) => {
  return (
    <div className="p-4 bg-background/50 rounded-lg space-y-4">
      {/* Existing entries */}
      {mealEntries.length > 0 && (
        <div className="space-y-2">
          {mealEntries.map((entry) => (
            <Card key={entry.id} className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{entry.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {entry.calories} kcal | {entry.proteins}g protéines
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Generated meal suggestion */}
      {generatedMeal && (
        <div className="space-y-3">
          <Card className="p-3">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{generatedMeal.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {generatedMeal.calories} kcal | {generatedMeal.proteins}g protéines
                  </p>
                </div>
              </div>

              {/* Shopping list section */}
              {generatedMeal.quantities && generatedMeal.quantities.length > 0 && (
                <div className="mt-3 border-t pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <h5 className="font-medium text-sm">Liste de courses</h5>
                  </div>
                  <ScrollArea className="h-[100px] w-full">
                    <ul className="space-y-1">
                      {generatedMeal.quantities.map((item, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <span className="text-muted-foreground">•</span>
                          {item.item}: {item.amount}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              )}

              {/* Preparation instructions if available */}
              {generatedMeal.preparation && (
                <p className="text-sm text-muted-foreground mt-2">
                  {generatedMeal.preparation}
                </p>
              )}
            </div>
          </Card>

          {onMealStatus && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onMealStatus('taken')}
              >
                <Check className="h-4 w-4 mr-2" />
                Valider
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onMealStatus('skipped')}
              >
                <X className="h-4 w-4 mr-2" />
                Non pris
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
