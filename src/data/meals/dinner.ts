import { Meal } from "./types";

export const dinnerMeals: Meal[] = [
  {
    name: "Poulet grillé et légumes",
    calories: 450,
    proteins: 35,
    carbs: 40,
    fats: 15,
    estimated_cost: 6,
    quantities: [
      { item: "Blanc de poulet", amount: "200g" },
      { item: "Brocolis", amount: "200g" },
      { item: "Carottes", amount: "150g" },
      { item: "Huile d'olive", amount: "1 càs" }
    ],
    notes: "Griller le poulet 6-7min de chaque côté. Cuire les légumes à la vapeur"
  },
  {
    name: "Saumon aux légumes",
    calories: 480,
    proteins: 38,
    carbs: 30,
    fats: 22,
    estimated_cost: 8,
    quantities: [
      { item: "Filet de saumon", amount: "180g" },
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
    carbs: 45,
    fats: 18,
    estimated_cost: 7,
    quantities: [
      { item: "Steak haché 5%", amount: "200g" },
      { item: "Riz complet", amount: "80g cru" },
      { item: "Haricots verts", amount: "200g" },
      { item: "Huile d'olive", amount: "1 càs" }
    ],
    notes: "Cuire le riz selon les instructions du paquet. Griller le steak 3-4min de chaque côté selon la cuisson désirée. Cuire les haricots à la vapeur"
  },
  {
    name: "Omelette aux légumes",
    calories: 400,
    proteins: 28,
    carbs: 12,
    fats: 28,
    estimated_cost: 4,
    quantities: [
      { item: "Œufs", amount: "4 unités" },
      { item: "Champignons", amount: "100g" },
      { item: "Épinards", amount: "100g" },
      { item: "Fromage râpé", amount: "30g" }
    ],
    notes: "Battre les œufs. Faire revenir les légumes. Ajouter les œufs et le fromage. Cuire à feu moyen"
  },
  {
    name: "Poisson blanc et quinoa",
    calories: 420,
    proteins: 35,
    carbs: 40,
    fats: 14,
    estimated_cost: 7,
    quantities: [
      { item: "Filet de cabillaud", amount: "180g" },
      { item: "Quinoa", amount: "80g cru" },
      { item: "Tomates cerises", amount: "150g" },
      { item: "Huile d'olive", amount: "1 càs" }
    ],
    notes: "Cuire le quinoa selon les instructions. Cuire le poisson à la vapeur 8-10min. Ajouter les tomates en fin de cuisson"
  }
];

export const defaultDinner: Meal = dinnerMeals[0];