import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MealPlan, Meal, FoodItem } from "@/types/nutrition";
import { FoodDetails } from "./MealPlan/FoodDetails";
import { AlternativesDialog } from "./MealPlan/AlternativesDialog";
import { getPreparationInstructions } from "./MealPlan/PreparationInstructions";

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
  onUpdateMealPlan: (updatedPlan: MealPlan) => void;
}

export const MealPlanDisplay = ({ mealPlan, onUpdateMealPlan }: MealPlanDisplayProps) => {
  const { toast } = useToast();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const handleFoodChange = async (meal: Meal, oldFood: FoodItem, newFood: FoodItem) => {
    const updatedMeals = mealPlan.meals.map((m) => {
      if (m.id === meal.id) {
        const updatedFoods = m.foods.map((f) => 
          f.id === oldFood.id ? {
            ...newFood,
            preparation: getPreparationInstructions(newFood.name)
          } : f
        );
        return {
          ...m,
          foods: updatedFoods,
          totalCalories: updatedFoods.reduce((acc, f) => acc + f.calories, 0),
          totalProteins: updatedFoods.reduce((acc, f) => acc + f.proteins, 0),
        };
      }
      return m;
    });

    const updatedPlan = {
      ...mealPlan,
      meals: updatedMeals,
      totalCalories: updatedMeals.reduce((acc, m) => acc + m.totalCalories, 0),
      totalProteins: updatedMeals.reduce((acc, m) => acc + m.totalProteins, 0),
    };

    onUpdateMealPlan(updatedPlan);
    toast({
      title: "Plan mis à jour",
      description: "Les calories ont été recalculées automatiquement.",
    });
  };

  const handleExcludeFood = async (food: FoodItem) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      let { data: preferences, error } = await supabase
        .from('user_nutrition_preferences')
        .select('excluded_foods')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newPreferences, error: insertError } = await supabase
          .from('user_nutrition_preferences')
          .insert({
            user_id: user.id,
            excluded_foods: [food.name],
          })
          .select()
          .single();

        if (insertError) throw insertError;
        preferences = newPreferences;
      } else if (error) {
        throw error;
      }

      if (preferences) {
        const excludedFoods = preferences.excluded_foods || [];
        const updatedExcludedFoods = [...new Set([...excludedFoods, food.name])];

        const { error: updateError } = await supabase
          .from('user_nutrition_preferences')
          .update({ excluded_foods: updatedExcludedFoods })
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        toast({
          title: "Préférences mises à jour",
          description: `${food.name} ne sera plus proposé dans vos menus.`,
        });
      }
    } catch (error) {
      console.error('Error in handleExcludeFood:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des préférences",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan alimentaire - {mealPlan.day}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mealPlan.meals.map((meal) => (
            <div key={meal.id} className="space-y-2">
              <h3 className="font-medium">{meal.name}</h3>
              <div className="space-y-2">
                {meal.foods.map((food) => (
                  <div
                    key={food.id}
                    className="flex items-center justify-between p-2 rounded bg-muted/50"
                  >
                    <div className="flex-1">
                      <FoodDetails food={food} />
                    </div>
                    <div className="flex gap-2">
                      <AlternativesDialog
                        food={food}
                        meal={meal}
                        onFoodChange={handleFoodChange}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExcludeFood(food)}
                      >
                        Ne plus proposer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Total: {meal.totalCalories} kcal | {meal.totalProteins}g protéines
              </div>
            </div>
          ))}
          <div className="pt-4 border-t">
            <p className="font-medium">
              Total journalier: {mealPlan.totalCalories} kcal | {mealPlan.totalProteins}g protéines
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};