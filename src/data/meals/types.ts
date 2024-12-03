export interface Meal {
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  estimated_cost: number;
  benefits?: string;
}

export interface MealWithTitle {
  title: string;
  meal: Meal;
}

export interface MealPlan {
  day: string;
  meals: Record<string, Meal>;
}