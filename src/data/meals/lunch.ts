import { Meal } from './types';

export const lunchMeals: Meal[] = [
  {
    name: "Saumon grillé, quinoa et légumes verts",
    calories: 550,
    proteins: 35,
    carbs: 45,
    fats: 20,
    estimated_cost: 7,
    quantities: [
      { item: "Pavé de saumon", amount: "150g" },
      { item: "Quinoa cru", amount: "60g" },
      { item: "Brocolis", amount: "150g" },
      { item: "Huile d'olive", amount: "1 càs" }
    ],
    notes: "Faire cuire le quinoa 15min. Griller le saumon 4min de chaque côté. Cuire les brocolis à la vapeur"
  },
  {
    name: "Bowl de tofu grillé et légumes rôtis",
    calories: 480,
    proteins: 25,
    carbs: 55,
    fats: 18,
    estimated_cost: 5,
    quantities: [
      { item: "Tofu ferme", amount: "200g" },
      { item: "Patate douce", amount: "200g" },
      { item: "Pois chiches", amount: "100g" },
      { item: "Légumes variés", amount: "200g" }
    ],
    notes: "Couper les légumes et la patate douce en cubes. Les disposer sur une plaque avec les pois chiches, assaisonner et rôtir 25min au four à 180°C. Pendant ce temps, couper le tofu en cubes, l'assaisonner et le griller à la poêle 3-4min de chaque côté jusqu'à ce qu'il soit doré."
  }
];

export const defaultLunch: Meal = lunchMeals[0];