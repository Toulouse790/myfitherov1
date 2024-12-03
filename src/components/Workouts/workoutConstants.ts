import { sampleWorkouts } from './data/sampleWorkouts';

export const muscleGroups = [
  { 
    id: "chest", 
    name: "Pectoraux", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop",
    selectedExercises: 12,
    totalExercises: 44
  },
  { 
    id: "back", 
    name: "Dos", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop",
    selectedExercises: 8,
    totalExercises: 54
  },
  { 
    id: "shoulders", 
    name: "Épaules", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=200&fit=crop",
    selectedExercises: 8,
    totalExercises: 51
  },
  { 
    id: "biceps", 
    name: "Biceps", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=300&h=200&fit=crop",
    selectedExercises: 6,
    totalExercises: 35
  },
  { 
    id: "triceps", 
    name: "Triceps", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=300&h=200&fit=crop",
    selectedExercises: 7,
    totalExercises: 28
  },
  { 
    id: "quadriceps", 
    name: "Quadriceps", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=200&fit=crop",
    selectedExercises: 7,
    totalExercises: 73
  },
  { 
    id: "hamstrings", 
    name: "Ischio-jambiers", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=200&fit=crop",
    selectedExercises: 3,
    totalExercises: 18
  },
  { 
    id: "glutes", 
    name: "Fessiers", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=200&fit=crop",
    selectedExercises: 3,
    totalExercises: 20
  },
  { 
    id: "abs", 
    name: "Abdominaux", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
    selectedExercises: 5,
    totalExercises: 50
  },
  { 
    id: "lower_back", 
    name: "Bas du dos", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop",
    selectedExercises: 1,
    totalExercises: 4
  },
  { 
    id: "fullBody", 
    name: "Full Body", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=300&h=200&fit=crop",
    selectedExercises: 0,
    totalExercises: 0
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
  muscleGroups: string[];  // Changed from muscleGroup to muscleGroups
  duration: string;
  exercises: string;
  difficulty: string;
  location: string;
}

export const initialFormData: WorkoutFormData = {
  title: "",
  muscleGroups: [],  // Changed from muscleGroup to muscleGroups array
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