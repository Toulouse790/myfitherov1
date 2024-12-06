import { Meal } from './types';

export const lunchMeals: Meal[] = [
  {
    name: "Saumon grillé, quinoa et légumes verts",
    calories: 550,
    proteins: 35,
    carbs: 45,
    fats: 20,
    estimated_cost: 7,
  },
  {
    name: "Bowl de tofu grillé et légumes rôtis",
    calories: 480,
    proteins: 25,
    carbs: 55,
    fats: 18,
    estimated_cost: 5,
  },
  {
    name: "Salade de lentilles aux légumes grillés",
    calories: 450,
    proteins: 20,
    carbs: 60,
    fats: 12,
    estimated_cost: 4,
  },
  {
    name: "Wrap aux falafels et sauce tahini",
    calories: 520,
    proteins: 18,
    carbs: 65,
    fats: 22,
    estimated_cost: 5,
  },
  {
    name: "Buddha bowl quinoa et pois chiches",
    calories: 490,
    proteins: 22,
    carbs: 58,
    fats: 16,
    estimated_cost: 4.5,
  },
  {
    name: "Nouilles soba aux légumes sautés",
    calories: 440,
    proteins: 16,
    carbs: 70,
    fats: 10,
    estimated_cost: 4,
  },
  {
    name: "Curry de légumes et riz complet",
    calories: 510,
    proteins: 14,
    carbs: 75,
    fats: 15,
    estimated_cost: 4.5,
  }
];

export const defaultLunch: Meal = lunchMeals[0];