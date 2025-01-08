import { MealEntry, GeneratedMeal } from "./types";

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
  mealStatus: 'taken' | 'skipped' | null;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface MealContentProps {
  mealEntries: MealEntry[];
  generatedMeal?: GeneratedMeal;
  onMealStatus: (status: 'taken' | 'skipped') => void;
}