import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDailyTargets = () => {
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

  const calculateDailyTargets = (questionnaire: any) => {
    if (!questionnaire) return {
      calories: 2000,
      proteins: 80
    };

    let baseCalories = 2000;
    
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

  return {
    dailyTargets,
    mealPlan,
    userPreferences
  };
};