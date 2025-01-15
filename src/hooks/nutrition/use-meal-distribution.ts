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

  // Distribution des calories selon les repas
  const breakfastRatio = 0.25; // 25% des calories pour le petit-déjeuner
  const lunchRatio = 0.35;     // 35% des calories pour le déjeuner
  const dinnerRatio = 0.30;    // 30% des calories pour le dîner
  const snackRatio = 0.10;     // 10% des calories pour les collations (5% chacune si deux collations)

  // Distribution des protéines selon les repas (similaire aux calories)
  const breakfastProteinRatio = 0.25;
  const lunchProteinRatio = 0.35;
  const dinnerProteinRatio = 0.30;
  const snackProteinRatio = 0.10;

  const totalCalories = dailyTargets.calories || 2000;
  const totalProteins = dailyTargets.proteins || 150;

  let mealDistribution: Record<string, MealDistribution> = {
    breakfast: {
      calories: Math.round(totalCalories * breakfastRatio),
      proteins: Math.round(totalProteins * breakfastProteinRatio),
      name: "Petit-déjeuner équilibré"
    },
    lunch: {
      calories: Math.round(totalCalories * lunchRatio),
      proteins: Math.round(totalProteins * lunchProteinRatio),
      name: "Déjeuner nutritif"
    },
    dinner: {
      calories: Math.round(totalCalories * dinnerRatio),
      proteins: Math.round(totalProteins * dinnerProteinRatio),
      name: "Dîner léger"
    }
  };

  // Ajuster les collations en fonction des préférences utilisateur
  const individualSnackRatio = snackRatio / (hasMorningSnack && hasAfternoonSnack ? 2 : 1);
  const individualSnackProteinRatio = snackProteinRatio / (hasMorningSnack && hasAfternoonSnack ? 2 : 1);

  if (hasMorningSnack) {
    mealDistribution.morning_snack = {
      calories: Math.round(totalCalories * individualSnackRatio),
      proteins: Math.round(totalProteins * individualSnackProteinRatio),
      name: "Collation matinale"
    };
  }

  if (hasAfternoonSnack) {
    mealDistribution.afternoon_snack = {
      calories: Math.round(totalCalories * individualSnackRatio),
      proteins: Math.round(totalProteins * individualSnackProteinRatio),
      name: "Collation"
    };
  }

  // Vérification que la somme des calories correspond bien au total
  const totalDistributedCalories = Object.values(mealDistribution).reduce((sum, meal) => sum + meal.calories, 0);
  if (totalDistributedCalories !== totalCalories) {
    const diff = totalCalories - totalDistributedCalories;
    // Ajuster le repas principal pour compenser la différence
    mealDistribution.lunch.calories += diff;
  }

  console.log("Generated meal distribution:", mealDistribution);
  return mealDistribution;
};