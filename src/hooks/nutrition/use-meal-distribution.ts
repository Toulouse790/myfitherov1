
import { calculateBMR } from "./use-bmr-calculation";
import { usePhysiologicalMetrics } from "../use-physiological-metrics";

interface NutrientTargets {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

interface MealDistribution {
  breakfast: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  lunch: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  dinner: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  snacks: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
}

export const generateMealDistribution = (
  targets: NutrientTargets,
  userPreferences: any,
  todayPlan?: any
): MealDistribution => {
  // Distribution par défaut
  let distribution = {
    breakfast: 0.25, // 25% des calories au petit-déjeuner
    lunch: 0.35,     // 35% des calories au déjeuner
    dinner: 0.3,     // 30% des calories au dîner
    snacks: 0.1      // 10% des calories en collations
  };

  // Ajuster la distribution selon l'objectif
  if (userPreferences?.questionnaire?.objective === 'weight_loss') {
    distribution = {
      breakfast: 0.3,  // Plus au petit-déjeuner pour éviter les fringales
      lunch: 0.4,      // Repas principal à midi
      dinner: 0.2,     // Dîner léger
      snacks: 0.1
    };
  } else if (userPreferences?.questionnaire?.objective === 'muscle_gain') {
    distribution = {
      breakfast: 0.25,
      lunch: 0.3,
      dinner: 0.3,
      snacks: 0.15     // Plus de collations pour répartir les protéines
    };
  }

  // Ajuster selon les entraînements (jours d'entraînement vs repos)
  const hasWorkoutToday = userPreferences?.workoutSessions?.some((session: any) => {
    const sessionDate = new Date(session.created_at);
    const today = new Date();
    return sessionDate.getDate() === today.getDate() &&
           sessionDate.getMonth() === today.getMonth() &&
           sessionDate.getFullYear() === today.getFullYear();
  });

  if (hasWorkoutToday) {
    // Augmenter légèrement les calories les jours d'entraînement
    const workoutBoost = 1.1; // +10%
    targets = {
      calories: Math.round(targets.calories * workoutBoost),
      proteins: Math.round(targets.proteins * 1.1), // Plus de protéines
      carbs: Math.round(targets.carbs * 1.2),       // Plus de glucides pour l'énergie
      fats: targets.fats
    };
  }

  // Calculer les nutriments pour chaque repas
  return {
    breakfast: {
      calories: Math.round(targets.calories * distribution.breakfast),
      proteins: Math.round(targets.proteins * distribution.breakfast),
      carbs: Math.round(targets.carbs * distribution.breakfast),
      fats: Math.round(targets.fats * distribution.breakfast)
    },
    lunch: {
      calories: Math.round(targets.calories * distribution.lunch),
      proteins: Math.round(targets.proteins * distribution.lunch),
      carbs: Math.round(targets.carbs * distribution.lunch),
      fats: Math.round(targets.fats * distribution.lunch)
    },
    dinner: {
      calories: Math.round(targets.calories * distribution.dinner),
      proteins: Math.round(targets.proteins * distribution.dinner),
      carbs: Math.round(targets.carbs * distribution.dinner),
      fats: Math.round(targets.fats * distribution.dinner)
    },
    snacks: {
      calories: Math.round(targets.calories * distribution.snacks),
      proteins: Math.round(targets.proteins * distribution.snacks),
      carbs: Math.round(targets.carbs * distribution.snacks),
      fats: Math.round(targets.fats * distribution.snacks)
    }
  };
};

export const adjustMealTimingForWorkout = (
  mealDistribution: MealDistribution,
  workoutTime?: 'morning' | 'evening'
): MealDistribution => {
  if (!workoutTime) return mealDistribution;

  const adjustedDistribution = { ...mealDistribution };

  if (workoutTime === 'morning') {
    // Augmenter les glucides au petit-déjeuner et réduire les graisses
    adjustedDistribution.breakfast.carbs = Math.round(adjustedDistribution.breakfast.carbs * 1.2);
    adjustedDistribution.breakfast.fats = Math.round(adjustedDistribution.breakfast.fats * 0.8);
    
    // Augmenter les protéines post-entraînement
    adjustedDistribution.lunch.proteins = Math.round(adjustedDistribution.lunch.proteins * 1.2);
  } else if (workoutTime === 'evening') {
    // Augmenter les glucides au déjeuner pour préparer l'entraînement
    adjustedDistribution.lunch.carbs = Math.round(adjustedDistribution.lunch.carbs * 1.2);
    
    // Augmenter les protéines au dîner pour la récupération
    adjustedDistribution.dinner.proteins = Math.round(adjustedDistribution.dinner.proteins * 1.2);
    adjustedDistribution.dinner.carbs = Math.round(adjustedDistribution.dinner.carbs * 0.9);
  }

  return adjustedDistribution;
};
