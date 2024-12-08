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

const filterMeals = (meals: Meal[], dietType: string, excludedFoods: string[]): Meal[] => {
  return meals.filter(meal => {
    const mealName = meal.name.toLowerCase();
    
    if (!isDietCompatible(mealName, dietType)) {
      return false;
    }

    if (excludedFoods.some(food => mealName.includes(food.toLowerCase()))) {
      return false;
    }

    return true;
  });
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

  // Historique des repas pour éviter la répétition
  const lastBreakfasts: Meal[] = [];
  const lastLunches: Meal[] = [];
  const lastDinners: Meal[] = [];
  const lastMorningSnacks: Meal[] = [];
  const lastAfternoonSnacks: Meal[] = [];

  // Filtrer les repas selon le régime alimentaire et les exclusions
  const filteredBreakfasts = filterMeals(breakfastMeals, dietType, [...excludedFoods, ...allergies, ...intolerances]);
  const filteredLunches = filterMeals(lunchMeals, dietType, [...excludedFoods, ...allergies, ...intolerances]);
  const filteredDinners = filterMeals(dinnerMeals, dietType, [...excludedFoods, ...allergies, ...intolerances]);
  const filteredSnacks = filterMeals(snackMeals, dietType, [...excludedFoods, ...allergies, ...intolerances]);

  for (let day = 0; day < durationDays; day++) {
    const dayIndex = day % 7;
    const isTrainingDay = workoutDays.includes(dayIndex);
    const carbsTarget = calculateCarbsTarget(weightKg, isTrainingDay);

    // Sélectionner des repas différents des derniers jours
    const breakfast = getRandomMeal(filteredBreakfasts, lastBreakfasts);
    const morningSnack = getRandomMeal(filteredSnacks, lastMorningSnacks);
    const lunch = getRandomMeal(filteredLunches, lastLunches);
    const afternoonSnack = getRandomMeal(filteredSnacks, lastAfternoonSnacks);
    const dinner = getRandomMeal(filteredDinners, lastDinners);

    // Mettre à jour l'historique des repas
    lastBreakfasts.push(breakfast);
    lastLunches.push(lunch);
    lastDinners.push(dinner);
    lastMorningSnacks.push(morningSnack);
    lastAfternoonSnacks.push(afternoonSnack);

    const dayMeals = {
      breakfast,
      morning_snack: morningSnack,
      lunch,
      afternoon_snack: afternoonSnack,
      dinner
    };

    const totalCarbs = Object.values(dayMeals).reduce(
      (sum, meal) => sum + (meal?.carbs || 0),
      0
    );

    plan.push({
      day: weekDays[dayIndex],
      meals: dayMeals,
      totalCarbs,
      carbsTarget
    });
  }

  return plan;
};