interface MealDistribution {
  name: string;
  calories: number;
  proteins: number;
  preparation?: string;
}

interface MealPlanDay {
  breakfast: { name: string; calories: number; proteins: number; preparation?: string };
  lunch: { name: string; calories: number; proteins: number; preparation?: string };
  dinner: { name: string; calories: number; proteins: number; preparation?: string };
  snack?: { name: string; calories: number; proteins: number; preparation?: string };
}

export const generateMealDistribution = (
  dailyTargets: { calories: number; proteins: number },
  userPreferences: any,
  todayPlan?: any
) => {
  console.log("Generating meal distribution with:", { dailyTargets, userPreferences, todayPlan });
  
  const hasMorningSnack = userPreferences?.questionnaire?.has_morning_snack ?? true;
  const hasAfternoonSnack = userPreferences?.questionnaire?.has_afternoon_snack ?? true;

  if (todayPlan) {
    console.log("Using today's plan:", todayPlan);
    return {
      breakfast: {
        name: todayPlan.breakfast.name,
        calories: todayPlan.breakfast.calories,
        proteins: todayPlan.breakfast.proteins,
        preparation: todayPlan.breakfast.preparation
      },
      lunch: {
        name: todayPlan.lunch.name,
        calories: todayPlan.lunch.calories,
        proteins: todayPlan.lunch.proteins,
        preparation: todayPlan.lunch.preparation
      },
      dinner: {
        name: todayPlan.dinner.name,
        calories: todayPlan.dinner.calories,
        proteins: todayPlan.dinner.proteins,
        preparation: todayPlan.dinner.preparation
      },
      ...(hasMorningSnack && todayPlan.snack ? {
        morning_snack: {
          name: `${todayPlan.snack.name} (matin)`,
          calories: Math.round(todayPlan.snack.calories / 2),
          proteins: Math.round(todayPlan.snack.proteins / 2),
          preparation: todayPlan.snack.preparation
        }
      } : {}),
      ...(hasAfternoonSnack && todayPlan.snack ? {
        afternoon_snack: {
          name: `${todayPlan.snack.name} (après-midi)`,
          calories: Math.round(todayPlan.snack.calories / 2),
          proteins: Math.round(todayPlan.snack.proteins / 2),
          preparation: todayPlan.snack.preparation
        }
      } : {})
    };
  }

  // Plan par défaut si aucun plan n'est trouvé
  let mealDistribution: Record<string, MealDistribution> = {
    breakfast: {
      calories: Math.round(dailyTargets.calories * 0.25),
      proteins: Math.round(dailyTargets.proteins * 0.25),
      name: "Petit-déjeuner équilibré"
    },
    lunch: {
      calories: Math.round(dailyTargets.calories * 0.35),
      proteins: Math.round(dailyTargets.proteins * 0.35),
      name: "Déjeuner nutritif"
    },
    dinner: {
      calories: Math.round(dailyTargets.calories * 0.30),
      proteins: Math.round(dailyTargets.proteins * 0.30),
      name: "Dîner léger"
    }
  };

  if (hasMorningSnack) {
    mealDistribution.morning_snack = {
      calories: Math.round(dailyTargets.calories * 0.05),
      proteins: Math.round(dailyTargets.proteins * 0.05),
      name: "Collation matinale"
    };
  }

  if (hasAfternoonSnack) {
    mealDistribution.afternoon_snack = {
      calories: Math.round(dailyTargets.calories * 0.05),
      proteins: Math.round(dailyTargets.proteins * 0.05),
      name: "Collation"
    };
  }

  console.log("Generated meal distribution:", mealDistribution);
  return mealDistribution;
};