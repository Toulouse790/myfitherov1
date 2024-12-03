import { sampleWorkouts } from './data/sampleWorkouts';
import { exercises } from './exerciseLibrary';

// Calcul dynamique du nombre d'exercices par groupe musculaire
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
    name: "Pectoraux", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop",
    selectedExercises: 0,
    totalExercises: exerciseCounts["chest"] || 0
  },
  { 
    id: "back", 
    name: "Dos", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop",
    selectedExercises: 0,
    totalExercises: exerciseCounts["back"] || 0
  },
  { 
    id: "shoulders", 
    name: "Épaules", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=200&fit=crop",
    selectedExercises: 0,
    totalExercises: exerciseCounts["shoulders"] || 0
  },
  { 
    id: "biceps", 
    name: "Biceps", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=300&h=200&fit=crop",
    selectedExercises: 0,
    totalExercises: exerciseCounts["arms"] || 0
  },
  { 
    id: "triceps", 
    name: "Triceps", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=300&h=200&fit=crop",
    selectedExercises: 0,
    totalExercises: exerciseCounts["arms"] || 0
  },
  { 
    id: "quadriceps", 
    name: "Quadriceps", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=200&fit=crop",
    selectedExercises: 0,
    totalExercises: exerciseCounts["legs"] || 0
  },
  { 
    id: "hamstrings", 
    name: "Ischio-jambiers", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=200&fit=crop",
    selectedExercises: 0,
    totalExercises: exerciseCounts["legs"] || 0
  },
  { 
    id: "glutes", 
    name: "Fessiers", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=200&fit=crop",
    selectedExercises: 0,
    totalExercises: exerciseCounts["legs"] || 0
  },
  { 
    id: "abs", 
    name: "Abdominaux", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
    selectedExercises: 0,
    totalExercises: exerciseCounts["abs"] || 0
  },
  { 
    id: "lower_back", 
    name: "Bas du dos", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop",
    selectedExercises: 0,
    totalExercises: exerciseCounts["back"] || 0
  },
  { 
    id: "fullBody", 
    name: "Full Body", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=300&h=200&fit=crop",
    selectedExercises: 0,
    totalExercises: Object.values(exerciseCounts).reduce((a, b) => a + b, 0)
  },
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