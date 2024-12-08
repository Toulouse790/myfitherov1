import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { MealPlan } from "@/types/nutrition";
import { mealTypes } from "./DailyMeals/MealTypes";
import { MealSection } from "./DailyMeals/MealSection";
import { FoodEntry } from "@/types/food";

export const DailyMeals = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  // Fetch today's food journal entries
  useQuery({
    queryKey: ['food-journal-today'],
    queryFn: async () => {
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
      return data;
    }
  });

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

      const today = new Date().getDay();
      const dayIndex = today === 0 ? 6 : today - 1;

      const plan = generateBasicMealPlan(dayIndex, questionnaire.diet_type || 'omnivore');
      return plan;
    }
  });

  const entriesByMealType = entries.reduce((acc, entry) => {
    if (!acc[entry.meal_type]) {
      acc[entry.meal_type] = [];
    }
    acc[entry.meal_type].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repas du jour</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <ScrollArea className="h-[400px] pr-4">
          {Object.entries(mealTypes).map(([type, label]) => (
            <MealSection
              key={type}
              type={type}
              label={label}
              mealEntries={entriesByMealType[type] || []}
              generatedMeal={generatedPlan?.meals?.[type]}
              isExpanded={expandedMeal === type}
              onToggle={() => setExpandedMeal(expandedMeal === type ? null : type)}
            />
          ))}
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
