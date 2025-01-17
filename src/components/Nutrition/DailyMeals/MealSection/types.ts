export interface MealContentProps {
  mealEntries: any[];
  generatedMeal?: {
    name: string;
    calories: number;
    proteins: number;
    preparation?: string;
    quantities?: Array<{ item: string; amount: string; }>;
  };
  onMealStatus?: (status: 'taken' | 'skipped') => void;
  type: string;
}

export interface MealSectionProps {
  type: string;
  label: string;
  mealEntries: any[];
  generatedMeal?: {
    name: string;
    calories: number;
    proteins: number;
    preparation?: string;
    quantities?: Array<{ item: string; amount: string; }>;
  };
  isExpanded: boolean;
  onToggle: () => void;
}