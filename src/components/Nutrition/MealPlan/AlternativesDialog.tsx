import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FoodItem, Meal } from "@/types/nutrition";
import { getPreparationInstructions } from "./PreparationInstructions";

interface AlternativesDialogProps {
  food: FoodItem;
  meal: Meal;
  onFoodChange: (meal: Meal, oldFood: FoodItem, newFood: FoodItem) => void;
}

export const AlternativesDialog = ({ food, meal, onFoodChange }: AlternativesDialogProps) => {
  if (!food.alternatives || food.alternatives.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Alternatives
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alternatives disponibles</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {food.alternatives.map((alt) => (
            <Button
              key={alt.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                const newFood = {
                  ...alt,
                  preparation: getPreparationInstructions(alt.name)
                };
                onFoodChange(meal, food, newFood);
              }}
            >
              <div>
                <p>{alt.name}</p>
                <p className="text-sm text-muted-foreground">
                  {alt.calories} kcal | {alt.proteins}g protéines
                </p>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};