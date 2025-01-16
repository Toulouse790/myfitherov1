export interface MealQuantity {
  item: string;
  amount: string;
}

export interface GeneratedMeal {
  name: string;
  calories: number;
  proteins: number;
  carbs?: number;
  fats?: number;
  quantities?: MealQuantity[];
  notes?: string;
  type?: string;
}

export interface MealEntry {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  carbs?: number;
  fats?: number;
  notes?: string;
}

export interface MealSectionProps {
  type: string;
  label: string;
  mealEntries: MealEntry[];
  generatedMeal?: GeneratedMeal;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface MealHeaderProps {
  label: string;
  mealStatus: 'taken' | 'skipped' | null | undefined;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface MealContentProps {
  mealEntries: MealEntry[];
  generatedMeal?: GeneratedMeal;
  onMealStatus?: (status: 'taken' | 'skipped') => void;
  type: string;
}