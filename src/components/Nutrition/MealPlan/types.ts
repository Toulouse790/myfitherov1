import { MealTitles } from "@/data/meals/types";

export interface DayMealsProps {
  day: string;
  meals: {
    breakfast: any;
    morning_snack: any;
    lunch: any;
    afternoon_snack: any;
    dinner: any;
  };
  mealTitles: MealTitles;
  isFirst?: boolean;
  isTrainingDay?: boolean;
  workoutTime?: 'morning' | 'evening';
}

export interface MealPlanData {
  breakfast: any;
  morning_snack: any;
  lunch: any;
  afternoon_snack: any;
  dinner: any;
}

export interface ActiveMealPlansProps {
  shoppingList?: string[];
}

export interface GeneratedPlanDisplayProps {
  generatedPlan: any[];
  durationDays: string;
}