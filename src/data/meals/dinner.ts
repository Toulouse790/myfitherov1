import { Meal } from './types';

export const dinnerMeals: Meal[] = [
  {
    name: "Poulet aux patates douces et brocolis",
    calories: 450,
    proteins: 35,
    carbs: 40,
    fats: 15,
    estimated_cost: 6,
  },
  {
    name: "Steak de seitan aux champignons",
    calories: 420,
    proteins: 30,
    carbs: 35,
    fats: 12,
    estimated_cost: 5,
  },
  {
    name: "Dahl de lentilles corail et riz",
    calories: 380,
    proteins: 18,
    carbs: 65,
    fats: 8,
    estimated_cost: 3.5,
  },
  {
    name: "Galette de quinoa aux légumes",
    calories: 400,
    proteins: 15,
    carbs: 55,
    fats: 14,
    estimated_cost: 4,
  },
  {
    name: "Wok de tempeh aux légumes",
    calories: 430,
    proteins: 25,
    carbs: 45,
    fats: 16,
    estimated_cost: 5,
  },
  {
    name: "Chili sin carne aux haricots rouges",
    calories: 390,
    proteins: 20,
    carbs: 60,
    fats: 10,
    estimated_cost: 4,
  },
  {
    name: "Gratin de courge butternut",
    calories: 360,
    proteins: 12,
    carbs: 50,
    fats: 12,
    estimated_cost: 4.5,
  }
];

export const defaultDinner: Meal = dinnerMeals[0];