import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { MealPlan } from "@/types/nutrition";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  meal_type: string;
}

export const DailyMeals = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  // Fetch today's food journal entries
  useEffect(() => {
    const fetchTodayEntries = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('food_journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching entries:', error);
        return;
      }

      setEntries(data || []);
    };

    fetchTodayEntries();
  }, []);

  // Fetch generated meal plan
  const { data: generatedPlan } = useQuery({
    queryKey: ['meal-plan'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: preferences } = await supabase
        .from('user_nutrition_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: questionnaire } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!preferences || !questionnaire) return null;

      // Get today's day of the week (0-6, where 0 is Sunday)
      const today = new Date().getDay();
      // Convert to 1-7 where 1 is Monday
      const dayIndex = today === 0 ? 6 : today - 1;

      // Use the mock data generator for now
      const plan = generateBasicMealPlan(dayIndex, questionnaire.diet_type || 'omnivore');
      return plan;
    }
  });

  const mealTypes = {
    breakfast: "Petit déjeuner",
    lunch: "Déjeuner",
    dinner: "Dîner",
    snack: "Collation"
  };

  const entriesByMealType = entries.reduce((acc, entry) => {
    if (!acc[entry.meal_type]) {
      acc[entry.meal_type] = [];
    }
    acc[entry.meal_type].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  const calculateMealTotals = (mealEntries: FoodEntry[]) => {
    return mealEntries.reduce(
      (totals, entry) => ({
        calories: totals.calories + entry.calories,
        proteins: totals.proteins + entry.proteins,
      }),
      { calories: 0, proteins: 0 }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repas du jour</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <ScrollArea className="h-[400px] pr-4">
          {Object.entries(mealTypes).map(([type, label]) => {
            const mealEntries = entriesByMealType[type] || [];
            const totals = calculateMealTotals(mealEntries);
            const generatedMeal = generatedPlan?.meals?.[type];

            return (
              <div key={type} className="mb-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto"
                  onClick={() => setExpandedMeal(expandedMeal === type ? null : type)}
                >
                  <div className="text-left">
                    <div className="font-medium">{label}</div>
                    {(mealEntries.length > 0 || generatedMeal) && (
                      <div className="text-sm text-muted-foreground">
                        {totals.calories} kcal • {totals.proteins}g protéines
                      </div>
                    )}
                  </div>
                  {expandedMeal === type ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {expandedMeal === type && (
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
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Helper function to generate a basic meal plan (temporary mock data)
const generateBasicMealPlan = (dayIndex: number, dietType: string) => {
  const meals = {
    breakfast: [
      { name: "Porridge aux fruits", calories: 300, proteins: 10, carbs: 45, fats: 8, notes: "Ajoutez des fruits frais de saison" },
      { name: "Œufs et toast", calories: 350, proteins: 15, carbs: 30, fats: 12, notes: "2 œufs et 2 tranches de pain complet" },
      { name: "Yaourt avec granola", calories: 280, proteins: 12, carbs: 40, fats: 6, notes: "Yaourt grec avec granola maison" }
    ],
    lunch: [
      { name: "Salade de quinoa", calories: 450, proteins: 18, carbs: 55, fats: 15, notes: "Riche en protéines végétales" },
      { name: "Sandwich poulet avocat", calories: 500, proteins: 25, carbs: 45, fats: 18, notes: "Pain complet, poulet grillé" },
      { name: "Bowl de riz aux légumes", calories: 400, proteins: 15, carbs: 60, fats: 10, notes: "Légumes de saison" }
    ],
    dinner: [
      { name: "Saumon grillé et légumes", calories: 550, proteins: 35, carbs: 30, fats: 25, notes: "Riche en oméga-3" },
      { name: "Pâtes aux légumes", calories: 480, proteins: 18, carbs: 70, fats: 12, notes: "Sauce tomate maison" },
      { name: "Poulet rôti et patates", calories: 600, proteins: 40, carbs: 45, fats: 20, notes: "Cuisson au four" }
    ],
    snack: [
      { name: "Fruit et noix", calories: 200, proteins: 5, carbs: 25, fats: 8, notes: "Une poignée de noix" },
      { name: "Barre protéinée", calories: 180, proteins: 15, carbs: 20, fats: 5, notes: "Avant ou après l'entraînement" },
      { name: "Smoothie aux fruits", calories: 150, proteins: 8, carbs: 30, fats: 2, notes: "Fruits mixés avec du lait végétal" }
    ]
  };

  // Filter meals based on diet type
  if (dietType === 'vegetarian') {
    meals.lunch = meals.lunch.filter(meal => !meal.name.includes('poulet'));
    meals.dinner = meals.dinner.filter(meal => !meal.name.includes('poulet') && !meal.name.includes('saumon'));
  }

  return {
    meals: {
      breakfast: meals.breakfast[dayIndex % meals.breakfast.length],
      lunch: meals.lunch[dayIndex % meals.lunch.length],
      dinner: meals.dinner[dayIndex % meals.dinner.length],
      snack: meals.snack[dayIndex % meals.snack.length]
    }
  };
};