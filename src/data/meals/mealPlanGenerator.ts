import { Meal, MealPlan } from './types';
import { breakfastMeals, defaultBreakfast } from './breakfast';
import { lunchMeals, defaultLunch } from './lunch';
import { dinnerMeals, defaultDinner } from './dinner';
import { snackMeals, defaultMorningSnack, defaultAfternoonSnack } from './snacks';

export const defaultMeals = {
  breakfast: { title: "Petit déjeuner", meal: defaultBreakfast },
  morning_snack: { title: "Collation matinale", meal: defaultMorningSnack },
  lunch: { title: "Déjeuner", meal: defaultLunch },
  afternoon_snack: { title: "Collation", meal: defaultAfternoonSnack },
  dinner: { title: "Dîner", meal: defaultDinner }
};

export const mealVariants = {
  breakfast: breakfastMeals,
  lunch: lunchMeals,
  dinner: dinnerMeals,
  snack: snackMeals
};

const calculateCarbsTarget = (
  weightKg: number,
  isTrainingDay: boolean,
  trainingIntensity: 'light' | 'moderate' | 'intense' = 'moderate'
): number => {
  if (!isTrainingDay) return Math.round(weightKg * 2.5); // 2-3g/kg les jours de repos

  switch (trainingIntensity) {
    case 'light':
      return Math.round(weightKg * 5); // 5g/kg
    case 'intense':
      return Math.round(weightKg * 8); // 7-10g/kg
    default: // moderate
      return Math.round(weightKg * 6); // 5-7g/kg
  }
};

const isDietCompatible = (mealName: string, dietType: string): boolean => {
  const lowerMealName = mealName.toLowerCase();
  
  switch (dietType) {
    case 'vegan':
      return !lowerMealName.includes('viande') && 
             !lowerMealName.includes('poulet') &&
             !lowerMealName.includes('poisson') &&
             !lowerMealName.includes('saumon') &&
             !lowerMealName.includes('thon') &&
             !lowerMealName.includes('oeuf') &&
             !lowerMealName.includes('fromage') &&
             !lowerMealName.includes('yaourt') &&
             !lowerMealName.includes('lait') &&
             !lowerMealName.includes('grec');
    case 'vegetarian':
      return !lowerMealName.includes('viande') && 
             !lowerMealName.includes('poulet') &&
             !lowerMealName.includes('poisson') &&
             !lowerMealName.includes('saumon') &&
             !lowerMealName.includes('thon');
    case 'pescatarian':
      return !lowerMealName.includes('viande') && 
             !lowerMealName.includes('poulet');
    default:
      return true;
  }
};

// Nouvelle fonction pour obtenir un repas aléatoire différent des derniers jours
const getRandomMeal = (meals: Meal[], lastMeals: Meal[], count: number = 3): Meal => {
  const availableMeals = meals.filter(meal => 
    !lastMeals.slice(-Math.min(count, lastMeals.length)).some(lastMeal => 
      lastMeal.name === meal.name
    )
  );
  return availableMeals.length > 0 
    ? availableMeals[Math.floor(Math.random() * availableMeals.length)]
    : meals[Math.floor(Math.random() * meals.length)];
};

export const generateVariedMealPlan = (
  durationDays: number,
  excludedFoods: string[] = [],
  allergies: string[] = [],
  intolerances: string[] = [],
  targetCalories: number = 2000,
  dietType: string = 'omnivore',
  weightKg: number = 70,
  workoutDays: number[] = []
): MealPlan[] => {
  const plan: MealPlan[] = [];
  const weekDays = [
    "Lundi", "Mardi", "Mercredi", "Jeudi",
    "Vendredi", "Samedi", "Dimanche"
  ];

  const filterMeals = (meals: Meal[]): Meal[] => {
    return meals.filter(meal => {
      const mealName = meal.name.toLowerCase();
      
      if (!isDietCompatible(mealName, dietType)) {
        return false;
      }

      if (excludedFoods.some(food => mealName.includes(food.toLowerCase()))) {
        return false;
      }

      if (allergies.some(allergy => mealName.includes(allergy.toLowerCase()))) {
        return false;
      }

      if (intolerances.some(intolerance => mealName.includes(intolerance.toLowerCase()))) {
        return false;
      }

      return true;
    });
  };

  // Filtrer tous les repas une seule fois
  const filteredBreakfastMeals = filterMeals(breakfastMeals);
  const filteredLunchMeals = filterMeals(lunchMeals);
  const filteredDinnerMeals = filterMeals(dinnerMeals);
  const filteredSnackMeals = filterMeals(snackMeals);

  // Garder une trace des derniers repas utilisés
  const lastBreakfasts: Meal[] = [];
  const lastLunches: Meal[] = [];
  const lastDinners: Meal[] = [];
  const lastMorningSnacks: Meal[] = [];
  const lastAfternoonSnacks: Meal[] = [];

  for (let day = 0; day < durationDays; day++) {
    const dayIndex = day % 7;
    const isTrainingDay = workoutDays.includes(dayIndex);
    const calorieAdjustment = targetCalories / 2000;
    const carbsTarget = calculateCarbsTarget(weightKg, isTrainingDay);

    // Sélectionner des repas différents des 3 derniers jours
    const breakfastMeal = getRandomMeal(filteredBreakfastMeals, lastBreakfasts);
    const lunchMeal = getRandomMeal(filteredLunchMeals, lastLunches);
    const dinnerMeal = getRandomMeal(filteredDinnerMeals, lastDinners);
    const morningSnackMeal = getRandomMeal(filteredSnackMeals, lastMorningSnacks);
    const afternoonSnackMeal = getRandomMeal(filteredSnackMeals, lastAfternoonSnacks);

    // Mettre à jour les historiques
    lastBreakfasts.push(breakfastMeal);
    lastLunches.push(lunchMeal);
    lastDinners.push(dinnerMeal);
    lastMorningSnacks.push(morningSnackMeal);
    lastAfternoonSnacks.push(afternoonSnackMeal);

    const dayMeals = {
      breakfast: breakfastMeal,
      morning_snack: morningSnackMeal,
      lunch: lunchMeal,
      afternoon_snack: afternoonSnackMeal,
      dinner: dinnerMeal
    };

    const totalCarbs = Object.values(dayMeals).reduce(
      (sum, meal) => sum + (meal?.carbs || 0),
      0
    );

    plan.push({
      day: weekDays[dayIndex],
      meals: dayMeals,
      isTrainingDay,
      totalCarbs,
      carbsTarget
    });
  }

  return plan;
};