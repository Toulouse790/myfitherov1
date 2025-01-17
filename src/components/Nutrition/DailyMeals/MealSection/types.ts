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