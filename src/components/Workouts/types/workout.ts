export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  calories: number;
}

export interface WorkoutData {
  id: string;
  title: string;
  muscleGroups: string[];
  difficulty: string;
  duration: string;
  exercises: WorkoutExercise[];
}