import { sampleWorkouts } from './data/sampleWorkouts';

const calculateExerciseCounts = () => {
  const counts: { [key: string]: number } = {};
  exercises.forEach(exercise => {
    if (!counts[exercise.muscleGroup]) {
      counts[exercise.muscleGroup] = 0;
    }
    counts[exercise.muscleGroup]++;
  });
  return counts;
};

const exerciseCounts = calculateExerciseCounts();

export const muscleGroups = [
  { 
    id: "chest", 
    name: "Poitrine", 
    color: "bg-primary",
    image: "/lovable-uploads/86a01e96-7001-446f-a664-90f1a5414d5b.png",
    selectedExercises: 0,
    totalExercises: exerciseCounts["pectoraux"] || 0
  },
  { 
    id: "back", 
    name: "Dos", 
    color: "bg-primary",
    image: "/lovable-uploads/86a01e96-7001-446f-a664-90f1a5414d5b.png",
    selectedExercises: 0,
    totalExercises: exerciseCounts["dos"] || 0
  },
  { 
    id: "legs", 
    name: "Jambes", 
    color: "bg-primary",
    image: "/lovable-uploads/86a01e96-7001-446f-a664-90f1a5414d5b.png",
    selectedExercises: 0,
    totalExercises: exerciseCounts["jambes"] || 0
  },
  { 
    id: "shoulders", 
    name: "Épaules", 
    color: "bg-primary",
    image: "/lovable-uploads/86a01e96-7001-446f-a664-90f1a5414d5b.png",
    selectedExercises: 0,
    totalExercises: exerciseCounts["épaules"] || 0
  },
  { 
    id: "biceps", 
    name: "Biceps", 
    color: "bg-primary",
    image: "/lovable-uploads/86a01e96-7001-446f-a664-90f1a5414d5b.png",
    selectedExercises: 0,
    totalExercises: exerciseCounts["bras"] || 0
  },
  { 
    id: "triceps", 
    name: "Triceps", 
    color: "bg-primary",
    image: "/lovable-uploads/86a01e96-7001-446f-a664-90f1a5414d5b.png",
    selectedExercises: 0,
    totalExercises: exerciseCounts["bras"] || 0
  },
  { 
    id: "abs", 
    name: "Abdominaux", 
    color: "bg-primary",
    image: "/lovable-uploads/86a01e96-7001-446f-a664-90f1a5414d5b.png",
    selectedExercises: 0,
    totalExercises: exerciseCounts["abdominaux"] || 0
  }
];

export const difficultyLevels = [
  { id: "beginner", name: "Débutant" },
  { id: "intermediate", name: "Intermédiaire" },
  { id: "advanced", name: "Avancé" },
  { id: "expert", name: "Expert" },
];

export interface WorkoutFormData {
  title: string;
  muscleGroups: string[];
  duration: string;
  exercises: string;
  difficulty: string;
  location: string;
}

export const initialFormData: WorkoutFormData = {
  title: "",
  muscleGroups: [],
  duration: "45",
  exercises: "",
  difficulty: "beginner",
  location: "home"
};

export interface WorkoutData extends Omit<WorkoutFormData, 'duration' | 'exercises'> {
  id: string;
  duration: number;
  exercises: Array<{
    name: string;
    sets?: number;
    reps?: number;
    calories?: number;
    image?: string;
  }>;
  lastPerformed?: string;
  completedCount?: number;
  totalCalories: number;
}

export const workouts = sampleWorkouts;

