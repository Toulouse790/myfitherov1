import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { mealTypes } from "./DailyMeals/MealTypes";
import { MealSection } from "./DailyMeals/MealSection";
import { FoodEntry } from "@/types/food";

export const DailyMeals = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  // Fetch user's questionnaire responses and preferences
  const { data: userPreferences } = useQuery({
    queryKey: ['user-nutrition-preferences'],
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

      return {
        preferences,
        questionnaire
      };
    }
  });

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

      const mappedEntries: FoodEntry[] = (data || []).map(entry => ({
        id: entry.id,
        name: entry.name,
        calories: entry.calories,
        proteins: entry.proteins,
        mealType: entry.meal_type
      }));

      setEntries(mappedEntries);
      return mappedEntries;
    }
  });

  // Calculate daily targets based on user profile
  const calculateDailyTargets = (questionnaire: any) => {
    if (!questionnaire) return {
      calories: 2000,
      proteins: 80
    };

    let baseCalories = 2000; // Default value
    
    // Adjust calories based on objective
    switch (questionnaire.objective) {
      case 'weight_loss':
        baseCalories = 1800;
        break;
      case 'muscle_gain':
        baseCalories = 2500;
        break;
      case 'maintenance':
        baseCalories = 2200;
        break;
      default:
        baseCalories = 2000;
    }

    // Adjust based on activity level
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9
    };

    const activityMultiplier = activityMultipliers[questionnaire.experience_level as keyof typeof activityMultipliers] || 1.375;
    
    const dailyCalories = Math.round(baseCalories * activityMultiplier);
    const dailyProteins = Math.round(questionnaire.objective === 'muscle_gain' ? dailyCalories * 0.3 / 4 : dailyCalories * 0.25 / 4);

    return {
      calories: dailyCalories,
      proteins: dailyProteins
    };
  };

  // Generate meal plan based on daily targets
  const generateMealPlan = (dailyTargets: { calories: number, proteins: number }) => {
    const mealDistribution = {
      breakfast: { calories: 0.25, proteins: 0.25 },
      lunch: { calories: 0.35, proteins: 0.35 },
      dinner: { calories: 0.3, proteins: 0.3 },
      snack: { calories: 0.1, proteins: 0.1 }
    };

    const dietType = userPreferences?.questionnaire?.diet_type || 'omnivore';

    return Object.entries(mealDistribution).reduce((acc, [meal, ratios]) => {
      acc[meal] = {
        calories: Math.round(dailyTargets.calories * ratios.calories),
        proteins: Math.round(dailyTargets.proteins * ratios.proteins)
      };
      return acc;
    }, {} as Record<string, { calories: number, proteins: number }>);
  };

  const dailyTargets = calculateDailyTargets(userPreferences?.questionnaire);
  const mealPlan = generateMealPlan(dailyTargets);

  const entriesByMealType = entries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = [];
    }
    acc[entry.mealType].push(entry);
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
              generatedMeal={{
                name: "Suggestion basée sur vos objectifs",
                calories: mealPlan[type]?.calories || 0,
                proteins: mealPlan[type]?.proteins || 0,
                notes: `Objectif: ${mealPlan[type]?.calories || 0} kcal, ${mealPlan[type]?.proteins || 0}g protéines`
              }}
              isExpanded={expandedMeal === type}
              onToggle={() => setExpandedMeal(expandedMeal === type ? null : type)}
            />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};