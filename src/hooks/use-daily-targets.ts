import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateBMR, getActivityMultiplier, getObjectiveMultiplier } from "./nutrition/use-bmr-calculation";
import { generateMealDistribution } from "./nutrition/use-meal-distribution";

export const useDailyTargets = () => {
  const { data: userPreferences } = useQuery({
    queryKey: ['user-nutrition-preferences'],
    queryFn: async () => {
      console.log("Fetching user nutrition preferences...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found");
        return null;
      }

      const { data: preferences } = await supabase
        .from('user_nutrition_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: questionnaire } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: measurements } = await supabase
        .from('muscle_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Récupérer le plan du jour
      const today = new Date();
      const { data: todayPlan } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .lte('start_date', today.toISOString())
        .gte('end_date', today.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log("Fetched data:", { preferences, questionnaire, measurements, todayPlan });
      return {
        preferences,
        questionnaire,
        measurements,
        todayPlan
      };
    }
  });

  const calculateDailyTargets = (data: any) => {
    console.log("Calculating daily targets with data:", data);
    if (!data?.questionnaire || !data?.measurements) {
      return {
        calories: 2000,
        proteins: 80
      };
    }

    const weight = data.measurements.weight_kg || 70;
    const height = data.measurements.height_cm || 170;
    const age = 30;
    const gender = data.questionnaire.gender || 'male';

    const bmr = calculateBMR(weight, height, age, gender);
    const activityMultiplier = getActivityMultiplier(data.questionnaire.experience_level);
    const objectiveMultiplier = getObjectiveMultiplier(data.questionnaire.objective);
    const dailyCalories = Math.round(bmr * activityMultiplier * objectiveMultiplier);
    
    let proteinMultiplier = 2;
    if (data.questionnaire.objective === 'weight_loss') {
      proteinMultiplier = 2.2;
    } else if (data.questionnaire.objective === 'muscle_gain') {
      proteinMultiplier = 2;
    }
    
    const dailyProteins = Math.round(weight * proteinMultiplier);

    return {
      calories: dailyCalories,
      proteins: dailyProteins
    };
  };

  const dailyTargets = calculateDailyTargets(userPreferences);
  const mealPlan = generateMealDistribution(
    dailyTargets,
    userPreferences,
    userPreferences?.todayPlan?.plan_data?.[new Date().getDay()]
  );

  console.log("Final daily targets:", dailyTargets);
  console.log("Final meal plan:", mealPlan);

  return {
    dailyTargets,
    mealPlan,
    userPreferences
  };
};