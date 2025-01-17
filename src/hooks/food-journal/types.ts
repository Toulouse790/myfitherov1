import { CommonFood } from "@/types/food";

export interface FoodJournalState {
  entries: any[];
  newFood: string;
  calories: string;
  proteins: string;
  carbs: string;
  fats: string;
  weight: string;
  notes: string;
  baseCalories: number;
  selectedCategory: string;
  filteredFoods: CommonFood[];
}

export interface FoodJournalActions {
  setNewFood: (value: string) => void;
  setCalories: (value: string) => void;
  setProteins: (value: string) => void;
  setCarbs: (value: string) => void;
  setFats: (value: string) => void;
  setWeight: (value: string) => void;
  setNotes: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  handleAddEntry: (mealType: string) => Promise<void>;
  handleSelectFood: (foodId: string) => void;
  handleBarcodeScan: (barcode: string) => Promise<void>;
  handleDeleteEntry: (id: string) => Promise<void>;
}