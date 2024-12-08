export interface CommonFood {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  category: "Protéines" | "Féculents" | "Légumes" | "Fruits" | "Produits laitiers" | "Autres";
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  mealType?: string;
  notes?: string;
}