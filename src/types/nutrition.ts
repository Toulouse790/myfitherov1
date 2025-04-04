
export interface FoodItem {
  id: string;
  user_id?: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  portion_size?: number;
  portion_unit?: string;
  meal_type?: string;
  created_at?: string;
  unit?: string;
  // Ajout des propriétés manquantes
  quantities?: Array<{ item: string; amount: string }>;
  alternatives?: FoodItem[];
}

// Ajout des interfaces manquantes
export interface Meal {
  id?: string;
  name: string;
  totalCalories?: number;
  totalProteins?: number;
  foods: FoodItem[];
}

export interface MealPlan {
  id?: string;
  day: string;
  meals: Meal[];
  totalCalories: number;
  totalProteins: number;
}
