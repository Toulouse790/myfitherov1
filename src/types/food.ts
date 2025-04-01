
export interface CommonFood {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  category: "Protéines" | "Féculents" | "Légumes" | "Fruits" | "Produits laitiers" | "Autres";
  description?: string;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  mealType?: string;
  notes?: string;
  description?: string;
  status?: 'taken' | 'skipped' | null;
  created_at?: string;
  is_composite?: boolean;
  components?: Array<{ name: string; portion: string }>;
}
