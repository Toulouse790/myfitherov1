export interface FoodJournalEntry {
  id: string;
  user_id: string | null;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  meal_type: string;
  created_at: string;
  updated_at: string;
}

export interface FoodJournalEntryInsert {
  user_id?: string | null;
  name: string;
  calories: number;
  proteins: number;
  carbs?: number;
  fats?: number;
  meal_type?: string;
}