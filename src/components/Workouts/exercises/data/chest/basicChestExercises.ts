import { Exercise } from '../../types/exercise';

export const basicChestExercises: Exercise[] = [
  {
    id: "chest_1",
    name: "Push-ups",
    muscle_group: "pectoraux",
    muscleGroup: "pectoraux",
    description: "Classic bodyweight chest exercise",
    difficulty: ["beginner", "intermediate"],
    equipment: "bodyweight",
    location: ["home", "gym", "outdoor"],
    instructions: [
      "Start in a plank position",
      "Lower your body until your chest nearly touches the ground",
      "Push back up to the starting position"
    ],
    targetMuscles: ["chest", "shoulders", "triceps"],
    objectives: ["muscle_gain", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 5
    },
    reps: {
      beginner: 10,
      intermediate: 15,
      advanced: 20
    },
    restTime: {
      beginner: 90,
      intermediate: 60,
      advanced: 45
    },
    calories: 100,
    is_published: true
  },
  {
    id: "chest_2",
    name: "Bench Press",
    muscle_group: "pectoraux",
    muscleGroup: "pectoraux",
    description: "Fundamental chest exercise with barbell",
    difficulty: ["intermediate", "advanced"],
    equipment: "barbell",
    location: ["gym"],
    instructions: [
      "Lie on a flat bench",
      "Grip the barbell slightly wider than shoulder width",
      "Lower the bar to your chest",
      "Press the bar back up to starting position"
    ],
    targetMuscles: ["chest", "shoulders", "triceps"],
    objectives: ["muscle_gain", "maintenance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 5
    },
    reps: {
      beginner: 8,
      intermediate: 10,
      advanced: 12
    },
    restTime: {
      beginner: 120,
      intermediate: 90,
      advanced: 60
    },
    calories: 150,
    is_published: true
  }
];