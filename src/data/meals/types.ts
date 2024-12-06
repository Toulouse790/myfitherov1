export interface Quantity {
  item: string;
  amount: string;
}

export interface Meal {
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  estimated_cost: number;
  quantities?: Quantity[];
  notes?: string;
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