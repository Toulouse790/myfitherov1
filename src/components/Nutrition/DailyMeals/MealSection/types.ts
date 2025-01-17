export interface MealContentProps {
  mealEntries: Array<{
    id: string;
    name: string;
    calories: number;
    proteins: number;
    components?: Array<{
      name: string;
      portion: string;
    }>;
  }>;
  generatedMeal?: {
    name: string;
    calories: number;
    proteins: number;
    quantities?: Array<{ item: string; amount: string; }>;
    preparation?: string;
  };
  onMealStatus?: (status: 'taken' | 'skipped') => void;
  mealType: string;
}

export interface MealHeaderProps {
  label: string;
  mealStatus?: 'taken' | 'skipped' | null;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface MealSectionProps {
  type: string;
  label: string;
  mealEntries: any[];
  generatedMeal?: {
    name: string;
    calories: number;
    proteins: number;
    notes?: string;
    quantities?: Array<{ item: string; amount: string; }>;
  };
  isExpanded: boolean;
  onToggle: () => void;
}