
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

      // Récupérer le profil utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Récupérer les préférences nutritionnelles
      const { data: preferences } = await supabase
        .from('user_nutrition_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Récupérer les réponses au questionnaire (pour les nouveaux utilisateurs)
      const { data: questionnaire } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Récupérer les dernières mesures
      const { data: measurements } = await supabase
        .from('muscle_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Get today's food journal entries using local date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const startOfDay = today.toISOString();
      const endOfDay = tomorrow.toISOString();
      
      console.log("Fetching entries between:", startOfDay, "and", endOfDay);
      
      const { data: foodEntries } = await supabase
        .from('food_journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startOfDay)
        .lt('created_at', endOfDay);

      // Calculate consumed nutrients
      const consumedNutrients = (foodEntries || []).reduce((acc, entry) => ({
        calories: acc.calories + (entry.calories || 0),
        proteins: acc.proteins + (entry.proteins || 0),
        carbs: acc.carbs + (entry.carbs || 0),
        fats: acc.fats + (entry.fats || 0)
      }), {
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0
      });

      // Récupérer le plan du jour
      const { data: todayPlan } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .lte('start_date', today.toISOString())
        .gte('end_date', today.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log("Fetched data:", { profile, preferences, questionnaire, measurements, todayPlan, consumedNutrients });
      return {
        profile,
        preferences,
        questionnaire,
        measurements,
        todayPlan,
        consumedNutrients
      };
    },
    // Refetch every minute to ensure data is up to date
    refetchInterval: 60000,
  });

  const calculateDailyTargets = (data: any) => {
    console.log("Calculating daily targets with data:", data);
    if (!data?.profile && !data?.questionnaire && !data?.measurements) {
      console.log("Données insuffisantes pour calculer les besoins nutritionnels");
      return {
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0
      };
    }

    // Priorité aux mesures récentes, puis au questionnaire, puis aux valeurs par défaut
    const weight = data.measurements?.weight_kg || 
                  (data.profile?.weight_kg) || 
                  (data.questionnaire?.weight ? Number(data.questionnaire.weight) : 70);
    
    const height = data.measurements?.height_cm || 
                  (data.profile?.height_cm) || 
                  (data.questionnaire?.height ? Number(data.questionnaire.height) : 170);
    
    const age = data.profile?.age || 
               (data.questionnaire?.age ? Number(data.questionnaire.age) : 30);
    
    const gender = data.profile?.gender || 
                  (data.questionnaire?.gender || 'male');
    
    const objective = data.profile?.main_objective || 
                     (data.questionnaire?.objective || 'maintenance');
    
    const activityLevel = data.profile?.experience_level || 
                         (data.questionnaire?.experience_level || 'moderately_active');

    console.log("Paramètres finaux pour le calcul des besoins:", {
      weight, height, age, gender, objective, activityLevel
    });

    const bmr = calculateBMR(weight, height, age, gender);
    const activityMultiplier = getActivityMultiplier(activityLevel);
    const objectiveMultiplier = getObjectiveMultiplier(objective);
    const dailyCalories = Math.round(bmr * activityMultiplier * objectiveMultiplier);
    
    console.log("BMR calculé:", bmr);
    console.log("Calories journalières calculées:", dailyCalories);
    
    let proteinMultiplier = 2;
    if (objective === 'weight_loss') {
      proteinMultiplier = 2.2;
    } else if (objective === 'muscle_gain') {
      proteinMultiplier = 2;
    }
    
    const dailyProteins = Math.round(weight * proteinMultiplier);
    const dailyCarbs = Math.round((dailyCalories * 0.45) / 4); // 45% of calories from carbs
    const dailyFats = Math.round((dailyCalories * 0.25) / 9); // 25% of calories from fats

    return {
      calories: dailyCalories,
      proteins: dailyProteins,
      carbs: dailyCarbs,
      fats: dailyFats
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
    userPreferences,
    consumedNutrients: userPreferences?.consumedNutrients || {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0
    }
  };
};
