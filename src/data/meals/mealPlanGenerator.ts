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

export const generateVariedMealPlan = (
  durationDays: number,
  excludedFoods: string[] = [],
  allergies: string[] = [],
  intolerances: string[] = [],
  targetCalories: number = 2000,
  dietType: string = 'omnivore'
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

  // Fonction pour obtenir un repas aléatoire différent des derniers jours
  const getRandomMeal = (meals: Meal[], lastMeals: Meal[], count: number): Meal => {
    const availableMeals = meals.filter(meal => 
      !lastMeals.slice(-Math.min(count, lastMeals.length)).some(lastMeal => 
        lastMeal.name === meal.name
      )
    );
    return availableMeals.length > 0 
      ? availableMeals[Math.floor(Math.random() * availableMeals.length)]
      : meals[0];
  };

  // Garder une trace des derniers repas utilisés
  const lastBreakfasts: Meal[] = [];
  const lastLunches: Meal[] = [];
  const lastDinners: Meal[] = [];
  const lastMorningSnacks: Meal[] = [];
  const lastAfternoonSnacks: Meal[] = [];

  for (let day = 0; day < durationDays; day++) {
    const dayIndex = day % 7;
    const calorieAdjustment = targetCalories / 2000;

    // Sélectionner des repas différents des 3 derniers jours
    const breakfastMeal = getRandomMeal(filteredBreakfastMeals, lastBreakfasts, 3);
    const lunchMeal = getRandomMeal(filteredLunchMeals, lastLunches, 3);
    const dinnerMeal = getRandomMeal(filteredDinnerMeals, lastDinners, 3);
    const morningSnackMeal = getRandomMeal(filteredSnackMeals, lastMorningSnacks, 2);
    const afternoonSnackMeal = getRandomMeal(filteredSnackMeals, lastAfternoonSnacks, 2);

    // Mettre à jour les historiques
    lastBreakfasts.push(breakfastMeal);
    lastLunches.push(lunchMeal);
    lastDinners.push(dinnerMeal);
    lastMorningSnacks.push(morningSnackMeal);
    lastAfternoonSnacks.push(afternoonSnackMeal);

    plan.push({
      day: weekDays[dayIndex],
      meals: {
        breakfast: {
          ...breakfastMeal,
          calories: Math.round(breakfastMeal.calories * calorieAdjustment)
        },
        morning_snack: {
          ...morningSnackMeal,
          calories: Math.round(morningSnackMeal.calories * calorieAdjustment)
        },
        lunch: {
          ...lunchMeal,
          calories: Math.round(lunchMeal.calories * calorieAdjustment)
        },
        afternoon_snack: {
          ...afternoonSnackMeal,
          calories: Math.round(afternoonSnackMeal.calories * calorieAdjustment)
        },
        dinner: {
          ...dinnerMeal,
          calories: Math.round(dinnerMeal.calories * calorieAdjustment)
        }
      }
    });
  }

  return plan;
};