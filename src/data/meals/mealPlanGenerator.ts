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
  
  const filterAlternatives = (foods: Meal[]) => {
    return foods.filter(food => {
      const foodName = food.name.toLowerCase();
      const isCompatibleWithDiet = dietType === 'omnivore' || 
        (dietType === 'vegetarian' && !foodName.includes('viande')) ||
        (dietType === 'vegan' && !foodName.includes('viande') && !foodName.includes('poisson') && !foodName.includes('oeuf') && !foodName.includes('lait')) ||
        (dietType === 'pescatarian' && !foodName.includes('viande'));

      return isCompatibleWithDiet &&
             !excludedFoods.some(excluded => foodName.includes(excluded.toLowerCase())) &&
             !allergies.some(allergy => foodName.includes(allergy.toLowerCase())) &&
             !intolerances.some(intolerance => foodName.includes(intolerance.toLowerCase()));
    });
  };

  const generateAlternatives = (meal: Meal, type: string) => {
    const alternatives = mealVariants[type as keyof typeof mealVariants] || [];
    return {
      ...meal,
      alternatives: filterAlternatives(alternatives)
    };
  };

  for (let day = 0; day < durationDays; day++) {
    const dayIndex = day % 7;
    const breakfastVariant = breakfastMeals[day % breakfastMeals.length];
    const lunchVariant = lunchMeals[day % lunchMeals.length];
    const dinnerVariant = dinnerMeals[day % dinnerMeals.length];
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