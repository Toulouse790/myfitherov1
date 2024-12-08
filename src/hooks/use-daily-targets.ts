import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
  // Formule Mifflin-St Jeor - validée scientifiquement comme plus précise que Harris-Benedict
  const base = (10 * weight) + (6.25 * height) - (5 * age);
  return gender === 'female' ? base - 161 : base + 5;
};

const getActivityMultiplier = (activityLevel: string) => {
  // Multipliers basés sur les recommandations de l'OMS et études scientifiques
  const multipliers = {
    sedentary: 1.2, // Activité minimale
    lightly_active: 1.375, // 1-3 sessions/semaine
    moderately_active: 1.55, // 3-5 sessions/semaine
    very_active: 1.725, // 6-7 sessions/semaine
    extra_active: 1.9 // Athlètes, 2x/jour
  };
  return multipliers[activityLevel as keyof typeof multipliers] || 1.375;
};

const getObjectiveMultiplier = (objective: string) => {
  // Ajustements basés sur la littérature scientifique pour des résultats optimaux
  switch (objective) {
    case 'weight_loss':
      return 0.8; // Déficit de 20% recommandé pour une perte de poids saine
    case 'muscle_gain':
      return 1.1; // Surplus de 10% recommandé pour une prise de masse optimale
    case 'maintenance':
    default:
      return 1;
  }
};

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

      // Récupérer les mesures pour avoir le poids et la taille
      const { data: measurements } = await supabase
        .from('muscle_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        preferences,
        questionnaire,
        measurements
      };
    }
  });

  const calculateDailyTargets = (data: any) => {
    if (!data?.questionnaire || !data?.measurements) {
      return {
        calories: 2000, // Valeurs par défaut sécurisées
        proteins: 80
      };
    }

    const weight = data.measurements.weight_kg || 70; // Poids par défaut si non renseigné
    const height = data.measurements.height_cm || 170; // Taille par défaut si non renseignée
    const age = 30; // Âge par défaut si non renseigné
    const gender = data.questionnaire.gender || 'male';

    // Calcul du BMR avec Mifflin-St Jeor
    const bmr = calculateBMR(weight, height, age, gender);
    
    // Facteur d'activité basé sur le niveau d'activité
    const activityMultiplier = getActivityMultiplier(data.questionnaire.experience_level);
    
    // Ajustement selon l'objectif
    const objectiveMultiplier = getObjectiveMultiplier(data.questionnaire.objective);
    
    // Calories totales
    const dailyCalories = Math.round(bmr * activityMultiplier * objectiveMultiplier);
    
    // Protéines selon les recommandations scientifiques
    // 1.6-2.2g/kg pour prise de masse
    // 1.8-2.7g/kg pour perte de poids (protection masse musculaire)
    // 1.6-2.2g/kg pour maintien
    let proteinMultiplier = 2;
    if (data.questionnaire.objective === 'weight_loss') {
      proteinMultiplier = 2.2; // Protection maximale de la masse musculaire
    } else if (data.questionnaire.objective === 'muscle_gain') {
      proteinMultiplier = 2; // Optimal pour la synthèse protéique
    }
    
    const dailyProteins = Math.round(weight * proteinMultiplier);

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

  const dailyTargets = calculateDailyTargets(userPreferences);
  const mealPlan = generateMealPlan(dailyTargets);

  return {
    dailyTargets,
    mealPlan,
    userPreferences
  };
};