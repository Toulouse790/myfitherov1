import { Meal, MealPlan } from './types';
import { breakfastMeals, defaultBreakfast } from './breakfast';
import { lunchMeals, defaultLunch } from './lunch';
import { dinnerMeals, defaultDinner } from './dinner';
import { defaultMorningSnack, defaultAfternoonSnack } from './snacks';

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
  dinner: dinnerMeals
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
             !lowerMealName.includes('lait');
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
      
      // Vérifier la compatibilité avec le régime alimentaire
      if (!isDietCompatible(mealName, dietType)) {
        return false;
      }

      // Vérifier les aliments exclus
      if (excludedFoods.some(food => mealName.includes(food.toLowerCase()))) {
        return false;
      }

      // Vérifier les allergies
      if (allergies.some(allergy => mealName.includes(allergy.toLowerCase()))) {
        return false;
      }

      // Vérifier les intolérances
      if (intolerances.some(intolerance => mealName.includes(intolerance.toLowerCase()))) {
        return false;
      }

      return true;
    });
  };

  const generateAlternatives = (meal: Meal, type: string) => {
    const alternatives = mealVariants[type as keyof typeof mealVariants] || [];
    const filteredAlternatives = filterMeals(alternatives);
    
    return {
      ...meal,
      alternatives: filteredAlternatives
    };
  };

  for (let day = 0; day < durationDays; day++) {
    const dayIndex = day % 7;
    
    // Filtrer les repas selon le régime alimentaire et les préférences
    const filteredBreakfastMeals = filterMeals(breakfastMeals);
    const filteredLunchMeals = filterMeals(lunchMeals);
    const filteredDinnerMeals = filterMeals(dinnerMeals);

    // Sélectionner les repas filtrés
    const breakfastVariant = filteredBreakfastMeals[day % filteredBreakfastMeals.length] || defaultBreakfast;
    const lunchVariant = filteredLunchMeals[day % filteredLunchMeals.length] || defaultLunch;
    const dinnerVariant = filteredDinnerMeals[day % filteredDinnerMeals.length] || defaultDinner;
    const calorieAdjustment = targetCalories / 2000;

    plan.push({
      day: weekDays[dayIndex],
      meals: {
        breakfast: generateAlternatives({
          ...defaultBreakfast,
          ...breakfastVariant,
          calories: Math.round(breakfastVariant.calories * calorieAdjustment)
        }, "breakfast"),
        morning_snack: generateAlternatives({
          ...defaultMorningSnack,
          calories: Math.round(defaultMorningSnack.calories * calorieAdjustment)
        }, "snack"),
        lunch: generateAlternatives({
          ...defaultLunch,
          ...lunchVariant,
          calories: Math.round(lunchVariant.calories * calorieAdjustment)
        }, "lunch"),
        afternoon_snack: generateAlternatives({
          ...defaultAfternoonSnack,
          calories: Math.round(defaultAfternoonSnack.calories * calorieAdjustment)
        }, "snack"),
        dinner: generateAlternatives({
          ...defaultDinner,
          ...dinnerVariant,
          calories: Math.round(dinnerVariant.calories * calorieAdjustment)
        }, "dinner")
      }
    });
  }

  return plan;
};