import { supabase } from "@/integrations/supabase/client";

export const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
  const base = (10 * weight) + (6.25 * height) - (5 * age);
  return gender === 'female' ? base - 161 : base + 5;
};

export const getActivityMultiplier = (activityLevel: string) => {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9
  };
  return multipliers[activityLevel as keyof typeof multipliers] || 1.375;
};

export const getObjectiveMultiplier = (objective: string) => {
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

// Nouvelle fonction qui utilise la fonction SQL avec tous les paramètres
export const calculateCaloriesByGender = async (baseCalories: number, gender: string, weight: number, height: number, age: number) => {
  const { data, error } = await supabase
    .rpc('calculate_calories_by_gender', {
      base_calories: baseCalories,
      gender: gender,
      weight_kg: weight,
      height_cm: height,
      age: age
    });

  if (error) {
    console.error('Error calculating calories:', error);
    return baseCalories; // Retourne la valeur de base en cas d'erreur
  }

  return data;
};