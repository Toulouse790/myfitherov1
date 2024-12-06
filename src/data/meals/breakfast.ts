import { Meal } from './types';

export const breakfastMeals: Meal[] = [
  {
    name: "Porridge protéiné aux fruits rouges",
    calories: 350,
    proteins: 20,
    carbs: 45,
    fats: 10,
    estimated_cost: 3,
    quantities: [
      { item: "Flocons d'avoine", amount: "60g" },
      { item: "Fruits rouges", amount: "100g" },
      { item: "Protéine en poudre", amount: "30g" },
      { item: "Lait d'amande", amount: "250ml" }
    ],
    notes: "Faire chauffer le lait, ajouter les flocons et la protéine, mélanger et ajouter les fruits"
  },
  {
    name: "Bowl de skyr aux myrtilles et graines de chia",
    calories: 320,
    proteins: 25,
    carbs: 40,
    fats: 8,
    estimated_cost: 3.5,
    quantities: [
      { item: "Skyr nature", amount: "200g" },
      { item: "Myrtilles", amount: "100g" },
      { item: "Graines de chia", amount: "15g" },
      { item: "Miel", amount: "10g" }
    ],
    notes: "Préparer la veille pour laisser les graines de chia gonfler"
  },
  {
    name: "Smoothie bowl banane-épinards",
    calories: 300,
    proteins: 15,
    carbs: 50,
    fats: 7,
    estimated_cost: 3,
    quantities: [
      { item: "Banane", amount: "1 grande" },
      { item: "Épinards", amount: "50g" },
      { item: "Lait végétal", amount: "200ml" },
      { item: "Granola", amount: "30g" }
    ],
    notes: "Mixer tous les ingrédients sauf le granola, ajouter le granola au moment de servir"
  }
];

export const defaultBreakfast: Meal = breakfastMeals[0];