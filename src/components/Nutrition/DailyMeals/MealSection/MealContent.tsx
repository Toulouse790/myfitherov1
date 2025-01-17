import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Heart, Plus, ShoppingBag, X } from "lucide-react";
import { FoodEntryForm } from "../../FoodEntryForm";
import type { MealContentProps } from "./types";

export const MealContent = ({ 
  mealEntries, 
  generatedMeal, 
  onMealStatus,
  mealType 
}: MealContentProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isPremium] = useState(false);

  const handleFavoriteClick = async () => {
    setIsFavorite(!isFavorite);
  };

  const hasEntries = Array.isArray(mealEntries) && mealEntries.length > 0;
  const hasShoppingList = generatedMeal?.quantities && generatedMeal.quantities.length > 0;

  return (
    <div className="space-y-2 p-2 sm:p-4">
      {hasEntries ? (
        <div className="space-y-2">
          {mealEntries.map((entry) => (
            <Card key={entry.id} className="p-2 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="w-full sm:w-auto">
                  <h3 className="font-semibold text-base sm:text-lg">{entry.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {entry.calories} kcal | {entry.proteins}g protéines
                    {entry.carbs > 0 && ` | ${entry.carbs}g glucides`}
                    {entry.fats > 0 && ` | ${entry.fats}g lipides`}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : hasShoppingList ? (
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h3 className="font-semibold text-base sm:text-lg">Liste de courses</h3>
          </div>
          <ScrollArea className="h-[200px] sm:h-[300px] w-full pr-4">
            <ul className="space-y-2">
              {generatedMeal.quantities.map((item, index) => (
                <li 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <span className="text-sm sm:text-base">{item.item}</span>
                  <span className="text-sm sm:text-base text-muted-foreground">{item.amount}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </Card>
      ) : (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddMealOpen(true)}
            className="w-full sm:w-auto mb-3"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Ajouter un repas manuellement
          </Button>
          {onMealStatus && (
            <div className="flex justify-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMealStatus('taken')}
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                Valider
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMealStatus('skipped')}
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                Sauter
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un repas</DialogTitle>
          </DialogHeader>
          <FoodEntryForm
            newFood=""
            calories=""
            proteins=""
            carbs=""
            fats=""
            weight=""
            notes=""
            baseCalories={0}
            selectedCategory=""
            onFoodChange={() => {}}
            onCaloriesChange={() => {}}
            onProteinsChange={() => {}}
            onCarbsChange={() => {}}
            onFatsChange={() => {}}
            onWeightChange={() => {}}
            onNotesChange={() => {}}
            onAddEntry={() => {
              setIsAddMealOpen(false);
            }}
            preselectedMealType={mealType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};