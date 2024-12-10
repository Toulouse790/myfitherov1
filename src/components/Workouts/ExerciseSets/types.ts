export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}

export interface ExerciseSet {
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}