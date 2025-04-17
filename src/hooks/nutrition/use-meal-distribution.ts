
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
    name?: string;
  };
  lunch: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    name?: string;
  };
  dinner: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    name?: string;
  };
  morning_snack?: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    name?: string;
  };
  afternoon_snack?: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    name?: string;
  };
  snacks?: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    name?: string;
  };
}

export const generateMealDistribution = (
  targets: NutrientTargets,
  userPreferences: any,
  todayPlan?: any
): MealDistribution => {
  console.log("Generating meal distribution with targets:", targets);
  
  // Distribution par défaut
  let distribution = {
    breakfast: 0.25, // 25% des calories au petit-déjeuner
    lunch: 0.35,     // 35% des calories au déjeuner
    dinner: 0.3,     // 30% des calories au dîner
    morning_snack: 0.05, // 5% des calories en collation du matin
    afternoon_snack: 0.05, // 5% des calories en collation d'après-midi
  };

  // Ajuster la distribution selon l'objectif
  const objective = userPreferences?.profile?.main_objective || 
                  userPreferences?.questionnaire?.objective || 
                  'maintenance';
                  
  if (objective === 'weight_loss') {
    distribution = {
      breakfast: 0.3,       // Plus au petit-déjeuner pour éviter les fringales
      lunch: 0.35,          // Repas principal à midi
      dinner: 0.2,          // Dîner léger
      morning_snack: 0.075, // Collations réduites
      afternoon_snack: 0.075
    };
  } else if (objective === 'muscle_gain') {
    distribution = {
      breakfast: 0.25,
      lunch: 0.3,
      dinner: 0.3,
      morning_snack: 0.075, // Plus de collations pour répartir les protéines
      afternoon_snack: 0.075
    };
  }

  // Vérifier si l'utilisateur a indiqué ne pas prendre de collations
  const hasPreferences = userPreferences?.questionnaire;
  
  if (hasPreferences) {
    const hasMorningSnack = userPreferences.questionnaire.has_morning_snack !== false;
    const hasAfternoonSnack = userPreferences.questionnaire.has_afternoon_snack !== false;
    
    if (!hasMorningSnack && !hasAfternoonSnack) {
      // Redistribuer les calories des collations aux repas principaux
      const snackCalories = distribution.morning_snack + distribution.afternoon_snack;
      distribution.breakfast += snackCalories * 0.4;
      distribution.lunch += snackCalories * 0.3;
      distribution.dinner += snackCalories * 0.3;
      distribution.morning_snack = 0;
      distribution.afternoon_snack = 0;
    } else if (!hasMorningSnack) {
      // Redistribuer les calories de la collation du matin
      distribution.breakfast += distribution.morning_snack * 0.6;
      distribution.afternoon_snack += distribution.morning_snack * 0.4;
      distribution.morning_snack = 0;
    } else if (!hasAfternoonSnack) {
      // Redistribuer les calories de la collation de l'après-midi
      distribution.lunch += distribution.afternoon_snack * 0.4;
      distribution.dinner += distribution.afternoon_snack * 0.6;
      distribution.afternoon_snack = 0;
    }
  }

  // Ajuster selon les entraînements (jours d'entraînement vs repos)
  const hasWorkoutToday = userPreferences?.workoutSessions?.some((session: any) => {
    const sessionDate = new Date(session.created_at);
    const today = new Date();
    return sessionDate.getDate() === today.getDate() &&
           sessionDate.getMonth() === today.getMonth() &&
           sessionDate.getFullYear() === today.getFullYear();
  });

  let workoutTargets = { ...targets };
  
  if (hasWorkoutToday) {
    // Augmenter légèrement les calories les jours d'entraînement
    const workoutBoost = 1.1; // +10%
    workoutTargets = {
      calories: Math.round(targets.calories * workoutBoost),
      proteins: Math.round(targets.proteins * 1.1), // Plus de protéines
      carbs: Math.round(targets.carbs * 1.2),       // Plus de glucides pour l'énergie
      fats: targets.fats
    };
  }

  // Définir les noms des repas par défaut s'ils ne sont pas fournis par le plan
  const mealNames = {
    breakfast: "Petit déjeuner équilibré",
    lunch: "Déjeuner équilibré",
    dinner: "Dîner équilibré",
    morning_snack: "Collation matinale",
    afternoon_snack: "Collation d'après-midi"
  };

  // Intégrer le plan du jour s'il existe
  if (todayPlan) {
    for (const mealType in todayPlan) {
      if (distribution[mealType as keyof typeof distribution] !== undefined) {
        // Si le plan du jour a un nom spécifique pour ce repas, l'utiliser
        mealNames[mealType as keyof typeof mealNames] = todayPlan[mealType].name || mealNames[mealType as keyof typeof mealNames];
      }
    }
  }

  // Calculer les nutriments pour chaque repas
  const result: MealDistribution = {
    breakfast: {
      calories: Math.round(workoutTargets.calories * distribution.breakfast),
      proteins: Math.round(workoutTargets.proteins * distribution.breakfast),
      carbs: Math.round(workoutTargets.carbs * distribution.breakfast),
      fats: Math.round(workoutTargets.fats * distribution.breakfast),
      name: mealNames.breakfast
    },
    lunch: {
      calories: Math.round(workoutTargets.calories * distribution.lunch),
      proteins: Math.round(workoutTargets.proteins * distribution.lunch),
      carbs: Math.round(workoutTargets.carbs * distribution.lunch),
      fats: Math.round(workoutTargets.fats * distribution.lunch),
      name: mealNames.lunch
    },
    dinner: {
      calories: Math.round(workoutTargets.calories * distribution.dinner),
      proteins: Math.round(workoutTargets.proteins * distribution.dinner),
      carbs: Math.round(workoutTargets.carbs * distribution.dinner),
      fats: Math.round(workoutTargets.fats * distribution.dinner),
      name: mealNames.dinner
    }
  };

  // Ajouter les collations seulement si leur ration est > 0
  if (distribution.morning_snack > 0) {
    result.morning_snack = {
      calories: Math.round(workoutTargets.calories * distribution.morning_snack),
      proteins: Math.round(workoutTargets.proteins * distribution.morning_snack),
      carbs: Math.round(workoutTargets.carbs * distribution.morning_snack),
      fats: Math.round(workoutTargets.fats * distribution.morning_snack),
      name: mealNames.morning_snack
    };
  }

  if (distribution.afternoon_snack > 0) {
    result.afternoon_snack = {
      calories: Math.round(workoutTargets.calories * distribution.afternoon_snack),
      proteins: Math.round(workoutTargets.proteins * distribution.afternoon_snack),
      carbs: Math.round(workoutTargets.carbs * distribution.afternoon_snack),
      fats: Math.round(workoutTargets.fats * distribution.afternoon_snack),
      name: mealNames.afternoon_snack
    };
  }

  // Pour compatibilité avec le code existant
  result.snacks = {
    calories: (result.morning_snack?.calories || 0) + (result.afternoon_snack?.calories || 0),
    proteins: (result.morning_snack?.proteins || 0) + (result.afternoon_snack?.proteins || 0),
    carbs: (result.morning_snack?.carbs || 0) + (result.afternoon_snack?.carbs || 0),
    fats: (result.morning_snack?.fats || 0) + (result.afternoon_snack?.fats || 0)
  };

  console.log("Final meal distribution:", result);
  return result;
};

export const adjustMealTimingForWorkout = (
  mealDistribution: MealDistribution,
  workoutTime?: 'morning' | 'evening'
): MealDistribution => {
  if (!workoutTime) return mealDistribution;

  const adjustedDistribution = { ...mealDistribution };

  if (workoutTime === 'morning') {
    // Augmenter les glucides au petit-déjeuner et réduire les graisses
    if (adjustedDistribution.breakfast) {
      adjustedDistribution.breakfast.carbs = Math.round(adjustedDistribution.breakfast.carbs * 1.2);
      adjustedDistribution.breakfast.fats = Math.round(adjustedDistribution.breakfast.fats * 0.8);
    }
    
    // Augmenter les protéines post-entraînement
    if (adjustedDistribution.lunch) {
      adjustedDistribution.lunch.proteins = Math.round(adjustedDistribution.lunch.proteins * 1.2);
    }
  } else if (workoutTime === 'evening') {
    // Augmenter les glucides au déjeuner pour préparer l'entraînement
    if (adjustedDistribution.lunch) {
      adjustedDistribution.lunch.carbs = Math.round(adjustedDistribution.lunch.carbs * 1.2);
    }
    
    // Augmenter les protéines au dîner pour la récupération
    if (adjustedDistribution.dinner) {
      adjustedDistribution.dinner.proteins = Math.round(adjustedDistribution.dinner.proteins * 1.2);
      adjustedDistribution.dinner.carbs = Math.round(adjustedDistribution.dinner.carbs * 0.9);
    }
  }

  return adjustedDistribution;
};
