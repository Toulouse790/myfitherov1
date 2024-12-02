export const muscleGroups = [
  { 
    id: "chest", 
    name: "Pectoraux", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop"
  },
  { 
    id: "back", 
    name: "Dos", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop"
  },
  { 
    id: "legs", 
    name: "Jambes", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=200&fit=crop"
  },
  { 
    id: "shoulders", 
    name: "Épaules", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=200&fit=crop"
  },
  { 
    id: "arms", 
    name: "Bras", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=300&h=200&fit=crop"
  },
  { 
    id: "abs", 
    name: "Abdominaux", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
  },
  { 
    id: "fullBody", 
    name: "Full Body", 
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=300&h=200&fit=crop"
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
    location: "home",
    exercises: [
      {
        name: "Pompes",
        sets: 3,
        reps: 10,
        calories: 30
      },
      {
        name: "Squats",
        sets: 3,
        reps: 15,
        calories: 45
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
        name: "Développé couché",
        sets: 4,
        reps: 8,
        calories: 40
      },
      {
        name: "Dips",
        sets: 3,
        reps: 12,
        calories: 35
      }
    ]
  },
  {
    id: "3",
    title: "Cardio HIIT",
    muscleGroup: "fullBody",
    difficulty: "advanced",
    duration: 30,
    location: "outdoor",
    exercises: [
      {
        name: "Burpees",
        sets: 5,
        reps: 20,
        calories: 100
      },
      {
        name: "Mountain Climbers",
        sets: 5,
        reps: 30,
        calories: 80
      }
    ]
  },
];