import { Meal } from './types';

export const dinnerMeals: Meal[] = [
  {
    name: "Poulet aux patates douces et brocolis",
    calories: 450,
    proteins: 35,
    carbs: 40,
    fats: 15,
    estimated_cost: 6,
    quantities: [
      { item: "Blanc de poulet", amount: "150g" },
      { item: "Patate douce", amount: "200g" },
      { item: "Brocolis", amount: "200g" },
      { item: "Huile d'olive", amount: "1 càs" }
    ],
    notes: "Couper les patates douces en cubes et les rôtir 25min au four. Griller le poulet 6-7min de chaque côté"
  },
  {
    name: "Saumon grillé aux légumes",
    calories: 420,
    proteins: 32,
    carbs: 25,
    fats: 22,
    estimated_cost: 8,
    quantities: [
      { item: "Filet de saumon", amount: "150g" },
      { item: "Courgettes", amount: "200g" },
      { item: "Poivrons", amount: "150g" },
      { item: "Huile d'olive", amount: "1 càs" }
    ],
    notes: "Griller le saumon 4-5min de chaque côté. Faire revenir les légumes à la poêle"
  },
  {
    name: "Steak haché et riz complet",
    calories: 520,
    proteins: 40,
    carbs: 50,
    fats: 18,
    estimated_cost: 7,
    quantities: [
      { item: "Steak haché 5%", amount: "150g" },
      { item: "Riz complet", amount: "80g cru" },
      { item: "Haricots verts", amount: "200g" },
      { item: "Huile d'olive", amount: "1 càs" }
    ],
    notes: "Cuire le riz selon les instructions. Griller le steak selon la cuisson désirée. Cuire les haricots à la vapeur"
  },
  {
    name: "Omelette aux légumes",
    calories: 350,
    proteins: 25,
    carbs: 15,
    fats: 22,
    estimated_cost: 4,
    quantities: [
      { item: "Oeufs", amount: "3 unités" },
      { item: "Champignons", amount: "100g" },
      { item: "Épinards", amount: "100g" },
      { item: "Fromage allégé", amount: "30g" }
    ],
    notes: "Faire revenir les légumes, ajouter les oeufs battus et le fromage"
  }
];

export const defaultDinner: Meal = dinnerMeals[0];
