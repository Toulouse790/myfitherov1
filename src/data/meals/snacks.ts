import { Meal } from './types';

export const snackMeals: Meal[] = [
  {
    name: "Yaourt grec et fruits secs",
    calories: 200,
    proteins: 15,
    carbs: 20,
    fats: 8,
    estimated_cost: 2,
  },
  {
    name: "Smoothie protéiné banane-épinards",
    calories: 250,
    proteins: 20,
    carbs: 30,
    fats: 5,
    estimated_cost: 3,
  },
  {
    name: "Mix de noix et fruits secs",
    calories: 180,
    proteins: 6,
    carbs: 15,
    fats: 12,
    estimated_cost: 2,
  },
  {
    name: "Houmous et crudités",
    calories: 150,
    proteins: 5,
    carbs: 12,
    fats: 10,
    estimated_cost: 2,
  },
  {
    name: "Barre énergétique maison",
    calories: 220,
    proteins: 8,
    carbs: 25,
    fats: 11,
    estimated_cost: 1.5,
  },
  {
    name: "Pudding de chia aux fruits",
    calories: 190,
    proteins: 7,
    carbs: 22,
    fats: 9,
    estimated_cost: 2.5,
  },
  {
    name: "Tartine de beurre d'amande",
    calories: 210,
    proteins: 8,
    carbs: 18,
    fats: 14,
    estimated_cost: 2,
  }
];

export const defaultMorningSnack: Meal = snackMeals[0];
export const defaultAfternoonSnack: Meal = snackMeals[1];