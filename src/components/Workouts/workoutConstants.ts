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
  muscleGroup: string;
  duration: string;
  exercises: string;
  difficulty: string;
  location: string;
}

export interface WorkoutData extends Omit<WorkoutFormData, 'duration' | 'exercises'> {
  id: string;
  duration: number;
  exercises: Array<{
    name: string;
    sets?: number;
    reps?: number;
    calories?: number;
  }>;
}

export const initialFormData: WorkoutFormData = {
  title: "",
  muscleGroup: "",
  duration: "",
  exercises: "",
  difficulty: "",
  location: "",
};

export const sampleWorkouts: WorkoutData[] = [
  {
    id: "1",
    title: "Full Body Débutant",
    muscleGroup: "fullBody",
    difficulty: "beginner",
    duration: 45,
    location: "gym",
    exercises: [
      {
        name: "Leg Press",
        sets: 3,
        reps: 12,
        calories: 40
      },
      {
        name: "Machine Chest Press",
        sets: 3,
        reps: 12,
        calories: 35
      },
      {
        name: "Lat Pulldown",
        sets: 3,
        reps: 12,
        calories: 30
      }
    ]
  },
  {
    id: "2",
    title: "Push Day",
    muscleGroup: "chest",
    difficulty: "intermediate",
    duration: 60,
    location: "gym",
    exercises: [
      {
        name: "Machine Chest Press",
        sets: 4,
        reps: 10,
        calories: 45
      },
      {
        name: "Machine Shoulder Press",
        sets: 3,
        reps: 12,
        calories: 40
      },
      {
        name: "Machine Pec Fly",
        sets: 3,
        reps: 15,
        calories: 35
      }
    ]
  },
  {
    id: "3",
    title: "Leg Day",
    muscleGroup: "legs",
    difficulty: "advanced",
    duration: 45,
    location: "gym",
    exercises: [
      {
        name: "Leg Press",
        sets: 4,
        reps: 12,
        calories: 50
      },
      {
        name: "Leg Extension Machine",
        sets: 3,
        reps: 15,
        calories: 40
      },
      {
        name: "Leg Curl Machine",
        sets: 3,
        reps: 15,
        calories: 40
      },
      {
        name: "Machine Calf Raises",
        sets: 4,
        reps: 20,
        calories: 30
      }
    ]
  },
];