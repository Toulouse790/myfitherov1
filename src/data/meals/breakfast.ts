import { Meal } from './types';

export const breakfastMeals: Meal[] = [
  {
    name: "Oeufs brouillés, pain complet et avocat",
    calories: 400,
    proteins: 22,
    carbs: 35,
    fats: 15,
    estimated_cost: 4,
    benefits: "Combinaison optimale de protéines et graisses saines pour la satiété"
  },
  {
    name: "Bowl de skyr aux myrtilles et graines de chia",
    calories: 320,
    proteins: 25,
    carbs: 40,
    fats: 8,
    estimated_cost: 3.5,
    benefits: "Riche en antioxydants et oméga-3"
  }
];

export const defaultBreakfast: Meal = {
  name: "Porridge protéiné aux fruits rouges",
  calories: 350,
  proteins: 20,
  carbs: 45,
  fats: 10,
  estimated_cost: 3,
};