export interface CardioExerciseParameters {
  [key: string]: {
    unit: string;
    min: number;
    max: number;
    options?: string[];
  };
}

export interface CardioExercise {
  id: string;
  name: string;
  type: string;
  parameters: CardioExerciseParameters;
  calories_formula: string;
}