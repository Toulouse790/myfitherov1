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
    notes: "Faire chauffer le lait, ajouter les flocons et la protéine, mélanger et ajouter les fruits."
  },
  {
    name: "Bowl de skyr aux myrtilles",
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
    notes: "Préparer la veille pour laisser les graines de chia gonfler. Mélanger le skyr avec le miel, ajouter les myrtilles et les graines."
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
    notes: "Mixer la banane, les épinards et le lait. Verser dans un bol et ajouter le granola au moment de servir."
  },
  {
    name: "Œufs brouillés sur toast complet",
    calories: 380,
    proteins: 22,
    carbs: 35,
    fats: 18,
    estimated_cost: 3,
    quantities: [
      { item: "Œufs", amount: "3 unités" },
      { item: "Pain complet", amount: "2 tranches" },
      { item: "Avocat", amount: "1/2" },
      { item: "Tomates cerises", amount: "6 unités" }
    ],
    notes: "Battre les œufs, les cuire à feu doux en remuant. Toaster le pain, écraser l'avocat dessus. Ajouter les œufs et les tomates."
  },
  {
    name: "Omelette aux légumes",
    calories: 400,
    proteins: 28,
    carbs: 12,
    fats: 28,
    estimated_cost: 4,
    quantities: [
      { item: "Œufs", amount: "4 unités" },
      { item: "Champignons", amount: "100g" },
      { item: "Épinards", amount: "100g" },
      { item: "Fromage râpé", amount: "30g" }
    ],
    notes: "Battre les œufs. Faire revenir les champignons et les épinards dans une poêle. Verser les œufs battus, ajouter le fromage. Cuire à feu moyen jusqu'à ce que l'omelette soit dorée."
  }
];

export const defaultBreakfast: Meal = breakfastMeals[0];