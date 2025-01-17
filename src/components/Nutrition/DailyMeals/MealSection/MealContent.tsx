import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Heart, Plus, X } from "lucide-react";
import { MealContentProps } from "./types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FoodEntryForm } from "../../FoodEntryForm";

export const MealContent = ({ mealEntries, generatedMeal, onMealStatus, type }: MealContentProps) => {
  const hasEntries = Array.isArray(mealEntries) && mealEntries.length > 0;
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // À connecter avec votre logique premium

  const handleFavoriteClick = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (generatedMeal) {
        await supabase
          .from('user_nutrition_preferences')
          .upsert({
            user_id: user.id,
            favorite_meals: {
              ...generatedMeal,
              meal_type: type
            }
          });

        setIsFavorite(true);
        toast({
          title: "Repas ajouté aux favoris",
          description: "Ce repas vous sera suggéré plus souvent",
        });
      }
    } catch (error) {
      console.error('Error saving favorite meal:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le repas aux favoris",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2 p-3">
      {hasEntries ? (
        <div className="space-y-2">
          {mealEntries.map((entry) => (
            <Card key={entry.id} className="p-3">
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
        <div className="text-center">
          {isPremium && generatedMeal ? (
            <Card className="p-3 mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{generatedMeal.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                      onClick={handleFavoriteClick}
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {generatedMeal.calories} kcal | {generatedMeal.proteins}g protéines
                  </p>
                  {generatedMeal.preparation && (
                    <p className="text-sm text-muted-foreground mt-2 text-left">
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
              className="mb-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un repas manuellement
            </Button>
          )}
          {onMealStatus && (
            <div className="flex justify-center gap-2">
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
      )}

      <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
        <DialogContent>
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
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};