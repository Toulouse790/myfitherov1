import { Exercise } from '../../types/exercise';

export const advancedAbsExercises: Exercise[] = [
  {
    id: "abs-3",
    name: "Leg Raises",
    muscle_group: "abs",
    muscleGroup: "abs",
    description: "Targets the lower abs",
    difficulty: ["intermediate"],
    equipment: "None",
    location: ["home", "gym", "outdoor"],
    image_url: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
    instructions: [
      "Lie on your back",
      "Keep your legs straight",
      "Lift your legs to 90 degrees",
      "Lower them slowly"
    ],
    targetMuscles: ["lower abs"],
    objectives: ["muscle_gain", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
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
    calories: 90
  },
  {
    id: "abs-4",
    name: "Russian Twist",
    muscle_group: "abs",
    muscleGroup: "abs",
    description: "Excellent for the obliques",
    difficulty: ["intermediate"],
    equipment: "Weights (optional)",
    location: ["home", "gym", "outdoor"],
    image_url: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
    instructions: [
      "Sit with your knees bent",
      "Lean back slightly",
      "Twist your torso side to side",
      "Keep your abs engaged"
    ],
    targetMuscles: ["obliques", "abs"],
    objectives: ["muscle_gain", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
    },
    reps: {
      beginner: 20,
      intermediate: 30,
      advanced: 40
    },
    restTime: {
      beginner: 60,
      intermediate: 45,
      advanced: 30
    },
    calories: 100
  }
];