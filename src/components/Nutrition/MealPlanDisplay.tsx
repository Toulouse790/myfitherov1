import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MealPlan, Meal, FoodItem } from "@/types/nutrition";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
  onUpdateMealPlan: (updatedPlan: MealPlan) => void;
}

export const MealPlanDisplay = ({ mealPlan, onUpdateMealPlan }: MealPlanDisplayProps) => {
  const { toast } = useToast();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const getPreparationInstructions = (foodName: string) => {
    // Instructions de préparation spécifiques pour chaque plat
    const instructions: { [key: string]: string } = {
      "Œufs brouillés sur toast complet": "Battre les œufs, les cuire à feu doux en remuant. Toaster le pain, écraser l'avocat dessus. Ajouter les œufs et les tomates.",
      "Porridge protéiné aux fruits rouges": "Faire chauffer le lait, ajouter les flocons et la protéine, mélanger et ajouter les fruits.",
      "Bowl de tofu grillé et légumes rôtis": "Couper les légumes et la patate douce en cubes. Les disposer sur une plaque avec les pois chiches, assaisonner et rôtir 25min au four à 180°C. Pendant ce temps, couper le tofu en cubes, l'assaisonner et le griller à la poêle 3-4min de chaque côté jusqu'à ce qu'il soit doré.",
      "Cabillaud et purée de patates douces": "Cuire les patates douces à l'eau, les réduire en purée avec le lait. Cuire le poisson à la vapeur 8-10min. Faire revenir les épinards.",
      "Buddha bowl aux falafels": "Cuire le couscous. Réchauffer les falafels au four. Disposer tous les ingrédients dans un bol, napper de sauce tahini",
      "Houmous et crudités": "Mixer les pois chiches avec l'ail, le tahini, le jus de citron et l'huile d'olive jusqu'à obtenir une consistance lisse. Servir avec des bâtonnets de légumes.",
    };
    return instructions[foodName] || "Aucune instruction disponible";
  };

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
                    <div>
                      <p className="font-medium">{food.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {food.calories} kcal | {food.proteins}g protéines
                      </p>
                      {food.quantities && food.quantities.length > 0 && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          {food.quantities.map((q, idx) => (
                            <p key={idx}>{q.item}: {q.amount}</p>
                          ))}
                        </div>
                      )}
                      <p className="mt-2 text-sm text-muted-foreground italic">
                        💡 {getPreparationInstructions(food.name)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {food.alternatives && food.alternatives.length > 0 && (
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
                                  onClick={() => handleFoodChange(meal, food, alt)}
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
                      )}
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