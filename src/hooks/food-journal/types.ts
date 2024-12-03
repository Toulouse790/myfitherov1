export interface FoodJournalState {
  entries: any[];
  newFood: string;
  calories: string;
  proteins: string;
  weight: string;
  baseCalories: number;
  selectedCategory: string;
}

export interface FoodJournalActions {
  setNewFood: (value: string) => void;
  setCalories: (value: string) => void;
  setProteins: (value: string) => void;
  setWeight: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  handleAddEntry: () => Promise<void>;
  handleSelectFood: (foodId: string) => void;
  handleBarcodeScan: (barcode: string) => Promise<void>;
  handleDeleteEntry: (id: string) => Promise<void>;
}