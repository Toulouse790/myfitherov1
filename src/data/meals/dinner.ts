import { Meal } from './types';

export const dinnerMeals: Meal[] = [
  {
    name: "Dinde aux légumes rôtis et patate douce",
    calories: 420,
    proteins: 35,
    carbs: 35,
    fats: 12,
    estimated_cost: 5.5,
    benefits: "Combinaison optimale pour la récupération musculaire"
  },
  {
    name: "Lentilles corail, épinards et oeuf poché",
    calories: 380,
    proteins: 25,
    carbs: 45,
    fats: 10,
    estimated_cost: 4,
    benefits: "Association fer végétal et vitamine C pour absorption optimale"
  }
];

export const defaultDinner: Meal = {
  name: "Poulet aux patates douces et brocolis",
  calories: 450,
  proteins: 35,
  carbs: 40,
  fats: 15,
  estimated_cost: 6,
};