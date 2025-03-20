export interface MealPlan {
  id: string;
  day: string;
  meals: Meal[];
  totalCalories: number;
  totalProteins: number;
}

export interface Meal {
  id: string;
  name: string;
  foods: FoodItem[];
  type: "breakfast" | "lunch" | "dinner" | "snack";
  totalCalories: number;
  totalProteins: number;
  preparation?: string;
  quantities?: Array<{ item: string; amount: string; }>;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  quantity: number;
  unit: string;
  alternatives?: FoodItem[];
  preparation?: string;
  quantities?: Array<{ item: string; amount: string; }>;
}

export interface NutritionPreferences {
  allergies: string[];
  dietaryRestrictions: string[];
  calorieGoal: number;
  proteinGoal: number;
}

export interface NutrientTotals {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}
