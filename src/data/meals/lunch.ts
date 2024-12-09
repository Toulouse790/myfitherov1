import { Meal } from './types';

export const lunchMeals: Meal[] = [
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
  },
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
    name: "Salade de poulet César",
    calories: 450,
    proteins: 40,
    carbs: 20,
    fats: 25,
    estimated_cost: 6,
    quantities: [
      { item: "Blanc de poulet", amount: "150g" },
      { item: "Laitue romaine", amount: "200g" },
      { item: "Parmesan", amount: "30g" },
      { item: "Croûtons complets", amount: "30g" },
      { item: "Sauce César light", amount: "2 càs" }
    ],
    notes: "Griller le poulet et le couper en dés. Laver et couper la salade. Mélanger tous les ingrédients avec la sauce"
  },
  {
    name: "Wrap au thon et avocat",
    calories: 420,
    proteins: 32,
    carbs: 38,
    fats: 18,
    estimated_cost: 5,
    quantities: [
      { item: "Thon en conserve", amount: "160g" },
      { item: "Tortilla complète", amount: "2 unités" },
      { item: "Avocat", amount: "1 petit" },
      { item: "Tomate", amount: "1 unité" },
      { item: "Salade", amount: "50g" }
    ],
    notes: "Égoutter le thon, l'écraser avec l'avocat. Garnir les tortillas avec le mélange, les légumes et rouler"
  },
  {
    name: "Buddha bowl aux falafels",
    calories: 520,
    proteins: 28,
    carbs: 65,
    fats: 22,
    estimated_cost: 6,
    quantities: [
      { item: "Falafels", amount: "6 unités" },
      { item: "Couscous complet", amount: "70g cru" },
      { item: "Houmous", amount: "60g" },
      { item: "Légumes grillés", amount: "200g" },
      { item: "Sauce tahini", amount: "2 càs" }
    ],
    notes: "Cuire le couscous. Réchauffer les falafels au four. Disposer tous les ingrédients dans un bol, napper de sauce tahini"
  }
];

export const defaultLunch: Meal = lunchMeals[0];