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
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  quantity: number;
  unit: string;
  alternatives?: FoodItem[];
}

export interface NutritionPreferences {
  allergies: string[];
  dietaryRestrictions: string[];
  calorieGoal: number;
  proteinGoal: number;
}