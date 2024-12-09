import { Meal } from './types';

export const snackMeals: Meal[] = [
  {
    name: "Yaourt grec et fruits secs",
    calories: 200,
    proteins: 15,
    carbs: 20,
    fats: 8,
    estimated_cost: 2,
    quantities: [
      { item: "Yaourt grec 0%", amount: "200g" },
      { item: "Mélange de fruits secs", amount: "30g" },
      { item: "Miel", amount: "1 càc" }
    ],
    notes: "Mélanger le yaourt avec le miel, ajouter les fruits secs."
  },
  {
    name: "Smoothie protéiné banane-épinards",
    calories: 250,
    proteins: 20,
    carbs: 30,
    fats: 5,
    estimated_cost: 3,
    quantities: [
      { item: "Banane", amount: "1 moyenne" },
      { item: "Épinards", amount: "30g" },
      { item: "Protéine whey", amount: "30g" },
      { item: "Lait d'amande", amount: "250ml" }
    ],
    notes: "Mixer tous les ingrédients jusqu'à obtenir une consistance lisse."
  },
  {
    name: "Mix de noix et fruits secs",
    calories: 180,
    proteins: 6,
    carbs: 15,
    fats: 12,
    estimated_cost: 2,
    quantities: [
      { item: "Amandes", amount: "15g" },
      { item: "Noix de cajou", amount: "15g" },
      { item: "Raisins secs", amount: "20g" }
    ],
    notes: "Mélanger tous les ingrédients dans un petit contenant."
  },
  {
    name: "Houmous et crudités",
    calories: 150,
    proteins: 5,
    carbs: 12,
    fats: 10,
    estimated_cost: 2,
    quantities: [
      { item: "Houmous", amount: "60g" },
      { item: "Carottes", amount: "100g" },
      { item: "Concombre", amount: "100g" },
      { item: "Poivron", amount: "50g" }
    ],
    notes: "Couper les légumes en bâtonnets, servir avec le houmous."
  },
  {
    name: "Barre énergétique maison",
    calories: 220,
    proteins: 8,
    carbs: 25,
    fats: 11,
    estimated_cost: 1.5,
    quantities: [
      { item: "Flocons d'avoine", amount: "40g" },
      { item: "Beurre de cacahuète", amount: "20g" },
      { item: "Miel", amount: "15g" },
      { item: "Protéine en poudre", amount: "15g" }
    ],
    notes: "Mélanger tous les ingrédients, former des barres, réfrigérer 1h."
  }
];

export const defaultMorningSnack: Meal = snackMeals[0];
export const defaultAfternoonSnack: Meal = snackMeals[1];