import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Heart, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FoodEntryForm } from "../../FoodEntryForm";

interface MealContentProps {
  mealEntries: any[];
  generatedMeal?: {
    name: string;
    calories: number;
    proteins: number;
    preparation?: string;
    quantities?: Array<{ item: string; amount: string; }>;
  };
  onMealStatus?: (status: 'taken' | 'skipped') => void;
  mealType: string;
}

export const MealContent = ({ mealType, mealEntries, generatedMeal, onMealStatus }: MealContentProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isPremium] = useState(false); // À connecter avec votre logique premium

  const handleFavoriteClick = async () => {
    // ... keep existing code (favorite handling logic)
  };

  const hasEntries = Array.isArray(mealEntries) && mealEntries.length > 0;

  return (
    <div className="space-y-2 p-2 sm:p-3">
      {hasEntries ? (
        <div className="space-y-2">
          {mealEntries.map((entry) => (
            <Card key={entry.id} className="p-2 sm:p-3">
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
      ) : (
        <div className="text-center">
          {isPremium && generatedMeal ? (
            <Card className="p-2 sm:p-3 mb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="w-full sm:w-auto">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-base sm:text-lg">{generatedMeal.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                      onClick={handleFavoriteClick}
                    >
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {generatedMeal.calories} kcal | {generatedMeal.proteins}g protéines
                  </p>
                  {generatedMeal.preparation && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-left">
                      {generatedMeal.preparation}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddMealOpen(true)}
              className="mb-3 w-full sm:w-auto"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Ajouter un repas manuellement
            </Button>
          )}
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
            onAddEntry={(mealType) => {
              setIsAddMealOpen(false);
            }}
            preselectedMealType={mealType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};