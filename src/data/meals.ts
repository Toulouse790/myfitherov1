export const defaultMeals = {
  breakfast: {
    title: "Petit déjeuner",
    meal: {
      name: "Porridge protéiné aux fruits rouges",
      calories: 350,
      proteins: 20,
      carbs: 45,
      fats: 10,
      estimated_cost: 3,
    }
  },
  morning_snack: {
    title: "Collation matinale",
    meal: {
      name: "Yaourt grec et fruits secs",
      calories: 200,
      proteins: 15,
      carbs: 20,
      fats: 8,
      estimated_cost: 2,
    }
  },
  lunch: {
    title: "Déjeuner",
    meal: {
      name: "Saumon grillé, quinoa et légumes verts",
      calories: 550,
      proteins: 35,
      carbs: 45,
      fats: 20,
      estimated_cost: 7,
    }
  },
  afternoon_snack: {
    title: "Collation",
    meal: {
      name: "Smoothie protéiné banane-épinards",
      calories: 250,
      proteins: 20,
      carbs: 30,
      fats: 5,
      estimated_cost: 3,
    }
  },
  dinner: {
    title: "Dîner",
    meal: {
      name: "Poulet aux patates douces et brocolis",
      calories: 450,
      proteins: 35,
      carbs: 40,
      fats: 15,
      estimated_cost: 6,
    }
  }
};

// Variantes scientifiquement optimisées pour alterner
export const mealVariants = {
  breakfast: [
    {
      name: "Oeufs brouillés, pain complet et avocat",
      calories: 400,
      proteins: 22,
      carbs: 35,
      fats: 15,
      estimated_cost: 4,
      benefits: "Combinaison optimale de protéines et graisses saines pour la satiété"
    },
    {
      name: "Bowl de skyr aux myrtilles et graines de chia",
      calories: 320,
      proteins: 25,
      carbs: 40,
      fats: 8,
      estimated_cost: 3.5,
      benefits: "Riche en antioxydants et oméga-3"
    }
  ],
  lunch: [
    {
      name: "Tofu grillé, riz complet et légumineuses",
      calories: 520,
      proteins: 30,
      carbs: 60,
      fats: 18,
      estimated_cost: 5,
      benefits: "Association complète d'acides aminés végétaux"
    },
    {
      name: "Bowl de thon, quinoa et edamames",
      calories: 480,
      proteins: 40,
      carbs: 45,
      fats: 15,
      estimated_cost: 6,
      benefits: "Riche en oméga-3 et protéines complètes"
    }
  ],
  dinner: [
    {
      name: "Dinde aux légumes rôtis et patate douce",
      calories: 420,
      proteins: 35,
      carbs: 35,
      fats: 12,
      estimated_cost: 5.5,
      benefits: "Combinaison optimale pour la récupération musculaire"
    },
    {
      name: "Lentilles corail, épinards et oeuf poché",
      calories: 380,
      proteins: 25,
      carbs: 45,
      fats: 10,
      estimated_cost: 4,
      benefits: "Association fer végétal et vitamine C pour absorption optimale"
    }
  ]
};

// Fonction pour générer un plan de repas varié
export const generateVariedMealPlan = (durationDays: number) => {
  const plan = [];
  
  for (let day = 0; day < durationDays; day++) {
    const breakfastVariant = mealVariants.breakfast[day % mealVariants.breakfast.length];
    const lunchVariant = mealVariants.lunch[day % mealVariants.lunch.length];
    const dinnerVariant = mealVariants.dinner[day % mealVariants.dinner.length];

    plan.push({
      meals: {
        breakfast: {
          ...defaultMeals.breakfast.meal,
          ...breakfastVariant
        },
        morning_snack: defaultMeals.morning_snack.meal,
        lunch: {
          ...defaultMeals.lunch.meal,
          ...lunchVariant
        },
        afternoon_snack: defaultMeals.afternoon_snack.meal,
        dinner: {
          ...defaultMeals.dinner.meal,
          ...dinnerVariant
        }
      }
    });
  }

  return plan;
};