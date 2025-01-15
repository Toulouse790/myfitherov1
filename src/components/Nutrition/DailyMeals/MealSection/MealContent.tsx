import { Check, X, Plus, Minus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealContentProps } from "./types";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const MealContent = ({ mealEntries, generatedMeal, onMealStatus }: MealContentProps) => {
  const { dailyTargets, mealPlan } = useDailyTargets();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeal, setEditedMeal] = useState(generatedMeal);

  const handleSaveMeal = () => {
    setIsEditing(false);
  };

  const getNutritionalValues = () => {
    if (generatedMeal?.type && mealPlan[generatedMeal.type]) {
      const planMeal = mealPlan[generatedMeal.type];
      return {
        calories: planMeal.calories,
        proteins: planMeal.proteins,
        carbs: planMeal.carbs,
        fats: planMeal.fats
      };
    }
    return {
      calories: generatedMeal?.calories,
      proteins: generatedMeal?.proteins,
      carbs: generatedMeal?.carbs,
      fats: generatedMeal?.fats
    };
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
              {entry.calories} kcal | {entry.proteins}g protéines
              {entry.carbs !== undefined && ` | ${entry.carbs}g glucides`}
              {entry.fats !== undefined && ` | ${entry.fats}g lipides`}
            </div>
            <div className="flex justify-end gap-2">
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
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="font-medium text-gray-800">{generatedMeal.name}</div>
                <div className="text-sm text-muted-foreground">
                  {(() => {
                    const values = getNutritionalValues();
                    return `${values.calories} kcal | ${values.proteins}g protéines${
                      values.carbs !== undefined ? ` | ${values.carbs}g glucides` : ''
                    }${values.fats !== undefined ? ` | ${values.fats}g lipides` : ''}`;
                  })()}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier le repas</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nom du repas</Label>
                      <Input 
                        value={editedMeal?.name || ''} 
                        onChange={(e) => setEditedMeal(prev => ({...prev!, name: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Calories (kcal)</Label>
                      <Input 
                        type="number"
                        value={editedMeal?.calories || 0}
                        onChange={(e) => setEditedMeal(prev => ({...prev!, calories: parseInt(e.target.value)}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Protéines (g)</Label>
                      <Input 
                        type="number"
                        value={editedMeal?.proteins || 0}
                        onChange={(e) => setEditedMeal(prev => ({...prev!, proteins: parseInt(e.target.value)}))}
                      />
                    </div>
                    <Button onClick={handleSaveMeal} className="w-full">
                      Sauvegarder
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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