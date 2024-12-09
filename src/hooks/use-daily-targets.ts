import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";

const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
  const base = (10 * weight) + (6.25 * height) - (5 * age);
  return gender === 'female' ? base - 161 : base + 5;
};

const getActivityMultiplier = (activityLevel: string) => {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9
  };
  return multipliers[activityLevel as keyof typeof multipliers] || 1.375;
};

const getObjectiveMultiplier = (objective: string) => {
  switch (objective) {
    case 'weight_loss':
      return 0.8;
    case 'muscle_gain':
      return 1.1;
    case 'maintenance':
    default:
      return 1;
  }
};

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
        .single();

      const { data: questionnaire } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: measurements } = await supabase
        .from('muscle_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

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
        .single();

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

  const generateMealPlan = (dailyTargets: { calories: number, proteins: number }) => {
    console.log("Generating meal plan with targets:", dailyTargets);
    
    const hasMorningSnack = userPreferences?.questionnaire?.has_morning_snack ?? true;
    const hasAfternoonSnack = userPreferences?.questionnaire?.has_afternoon_snack ?? true;
    
    // Si nous avons un plan pour aujourd'hui, utilisons-le
    if (userPreferences?.todayPlan) {
      const today = new Date();
      const dayIndex = today.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
      const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convertir pour que 0 = Lundi
      const todayPlan = userPreferences.todayPlan.plan_data[adjustedDayIndex];

      if (todayPlan) {
        console.log("Using today's plan:", todayPlan);
        return {
          breakfast: {
            name: todayPlan.breakfast.name,
            calories: todayPlan.breakfast.calories,
            proteins: todayPlan.breakfast.proteins
          },
          lunch: {
            name: todayPlan.lunch.name,
            calories: todayPlan.lunch.calories,
            proteins: todayPlan.lunch.proteins
          },
          dinner: {
            name: todayPlan.dinner.name,
            calories: todayPlan.dinner.calories,
            proteins: todayPlan.dinner.proteins
          },
          ...(hasMorningSnack && todayPlan.snack ? {
            morning_snack: {
              name: todayPlan.snack.name,
              calories: Math.round(todayPlan.snack.calories / 2),
              proteins: Math.round(todayPlan.snack.proteins / 2)
            }
          } : {}),
          ...(hasAfternoonSnack && todayPlan.snack ? {
            afternoon_snack: {
              name: todayPlan.snack.name,
              calories: Math.round(todayPlan.snack.calories / 2),
              proteins: Math.round(todayPlan.snack.proteins / 2)
            }
          } : {})
        };
      }
    }

    // Plan par défaut si aucun plan n'est trouvé
    let mealDistribution: Record<string, { calories: number, proteins: number, name: string }> = {
      breakfast: { 
        calories: Math.round(dailyTargets.calories * 0.25), 
        proteins: Math.round(dailyTargets.proteins * 0.25),
        name: "Petit-déjeuner équilibré" 
      },
      lunch: { 
        calories: Math.round(dailyTargets.calories * 0.35), 
        proteins: Math.round(dailyTargets.proteins * 0.35),
        name: "Déjeuner nutritif" 
      },
      dinner: { 
        calories: Math.round(dailyTargets.calories * 0.30), 
        proteins: Math.round(dailyTargets.proteins * 0.30),
        name: "Dîner léger" 
      }
    };

    if (hasMorningSnack) {
      mealDistribution.morning_snack = {
        calories: Math.round(dailyTargets.calories * 0.05),
        proteins: Math.round(dailyTargets.proteins * 0.05),
        name: "Collation matinale"
      };
    }

    if (hasAfternoonSnack) {
      mealDistribution.afternoon_snack = {
        calories: Math.round(dailyTargets.calories * 0.05),
        proteins: Math.round(dailyTargets.proteins * 0.05),
        name: "Collation"
      };
    }

    console.log("Generated default meal plan:", mealDistribution);
    return mealDistribution;
  };

  const dailyTargets = calculateDailyTargets(userPreferences);
  const mealPlan = generateMealPlan(dailyTargets);

  console.log("Final daily targets:", dailyTargets);
  console.log("Final meal plan:", mealPlan);

  return {
    dailyTargets,
    mealPlan,
    userPreferences
  };
};