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
  is_cheat_meal?: boolean;
}

export interface MealTitles {
  [key: string]: {
    title: string;
    defaultTime: string;
  };
}

export interface MealPlan {
  day: string;
  meals: Record<string, Meal>;
  totalCarbs: number;
  carbsTarget: number;
}