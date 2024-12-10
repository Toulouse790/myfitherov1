import { snackMeals } from './snacks';
import { Meal } from './types';

export const defaultMeals = {
  breakfast: {
    title: "Petit déjeuner",
    defaultTime: "07:00"
  },
  morning_snack: {
    title: "Collation du matin",
    defaultTime: "10:00"
  },
  lunch: {
    title: "Déjeuner",
    defaultTime: "12:00"
  },
  afternoon_snack: {
    title: "Collation de l'après-midi",
    defaultTime: "16:00"
  },
  dinner: {
    title: "Dîner",
    defaultTime: "19:00"
  }
};

interface MealPlanDay {
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    morning_snack: Meal;
    afternoon_snack: Meal;
  };
}

export const generateVariedMealPlan = (
  durationDays: number,
  excludedFoods: string[] = [],
  allergies: string[] = [],
  intolerances: string[] = [],
  targetCalories: number = 2000,
  dietType: string = 'omnivore'
): MealPlanDay[] => {
  // For now, return a simple demo plan
  const defaultMeal: Meal = {
    name: "Repas équilibré",
    calories: Math.round(targetCalories / 5), // Divide daily calories by 5 meals
    proteins: 20,
    carbs: 30,
    fats: 10,
    estimated_cost: 5
  };

  const defaultSnack: Meal = snackMeals[0] || {
    name: "Collation saine",
    calories: Math.round(targetCalories / 10),
    proteins: 10,
    carbs: 15,
    fats: 5,
    estimated_cost: 2
  };

  return Array.from({ length: durationDays }, () => ({
    meals: {
      breakfast: { ...defaultMeal, name: "Petit-déjeuner équilibré" },
      lunch: { ...defaultMeal, name: "Déjeuner équilibré" },
      dinner: { ...defaultMeal, name: "Dîner équilibré" },
      morning_snack: { ...defaultSnack, name: "Collation du matin" },
      afternoon_snack: { ...defaultSnack, name: "Collation de l'après-midi" }
    }
  }));
};