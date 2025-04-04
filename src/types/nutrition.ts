
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
}
