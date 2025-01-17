export interface MealContentProps {
  mealEntries: any[];
  generatedMeal?: {
    name: string;
    calories: number;
    proteins: number;
    preparation?: string;
    quantities?: Array<{ item: string; amount: string; }>;
  };
  onMealStatus?: (status: 'taken' | 'skipped') => Promise<void>;
  mealType: string;
}

export interface MealHeaderProps {
  label: string;
  mealStatus: 'taken' | 'skipped' | null;
  isExpanded: boolean;
  onToggle: () => void;
}