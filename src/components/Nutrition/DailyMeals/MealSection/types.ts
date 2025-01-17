export interface MealContentProps {
  mealEntries: Array<{
    id: string;
    name: string;
    calories: number;
    proteins: number;
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