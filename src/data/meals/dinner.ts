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
    name: "Dahl de lentilles corail et riz",
    calories: 380,
    proteins: 18,
    carbs: 65,
    fats: 8,
    estimated_cost: 3.5,
    quantities: [
      { item: "Lentilles corail", amount: "100g" },
      { item: "Riz basmati", amount: "60g" },
      { item: "Lait de coco", amount: "200ml" },
      { item: "Épices curry", amount: "2 càc" }
    ],
    notes: "Faire cuire les lentilles 15-20min avec le lait de coco et les épices. Servir avec le riz"
  }
];

export const defaultDinner: Meal = dinnerMeals[0];