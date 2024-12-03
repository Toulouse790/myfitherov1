import { Meal } from './types';

export const lunchMeals: Meal[] = [
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
];

export const defaultLunch: Meal = {
  name: "Saumon grillé, quinoa et légumes verts",
  calories: 550,
  proteins: 35,
  carbs: 45,
  fats: 20,
  estimated_cost: 7,
};