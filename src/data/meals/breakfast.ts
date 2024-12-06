import { Meal } from './types';

export const breakfastMeals: Meal[] = [
  {
    name: "Porridge protéiné aux fruits rouges",
    calories: 350,
    proteins: 20,
    carbs: 45,
    fats: 10,
    estimated_cost: 3,
  },
  {
    name: "Bowl de skyr aux myrtilles et graines de chia",
    calories: 320,
    proteins: 25,
    carbs: 40,
    fats: 8,
    estimated_cost: 3.5,
  },
  {
    name: "Smoothie bowl banane-épinards",
    calories: 300,
    proteins: 15,
    carbs: 50,
    fats: 7,
    estimated_cost: 3,
  },
  {
    name: "Toast avocat et houmous",
    calories: 380,
    proteins: 12,
    carbs: 35,
    fats: 22,
    estimated_cost: 4,
  },
  {
    name: "Pancakes protéinés aux flocons d'avoine",
    calories: 400,
    proteins: 22,
    carbs: 48,
    fats: 12,
    estimated_cost: 3.5,
  },
  {
    name: "Granola maison et yaourt végétal",
    calories: 340,
    proteins: 12,
    carbs: 52,
    fats: 14,
    estimated_cost: 3,
  },
  {
    name: "Oeufs brouillés, pain complet et avocat",
    calories: 400,
    proteins: 22,
    carbs: 35,
    fats: 15,
    estimated_cost: 4,
  }
];

export const defaultBreakfast: Meal = breakfastMeals[0];