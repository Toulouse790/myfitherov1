import { Exercise } from '../../types/exercise';

export const basicAbsExercises: Exercise[] = [
  {
    id: "abs-1",
    name: "Crunch",
    muscle_group: "abdominaux",
    muscleGroup: "abdominaux",
    description: "Basic abdominal exercise",
    difficulty: ["beginner"],
    equipment: "None",
    location: ["home", "gym", "outdoor"],
    image_url: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
    instructions: [
      "Lie on your back",
      "Bend your knees",
      "Lift your shoulders off the ground",
      "Return slowly"
    ],
    targetMuscles: ["rectus abdominis", "obliques"],
    objectives: ["muscle_gain", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
    },
    reps: {
      beginner: 15,
      intermediate: 20,
      advanced: 25
    },
    restTime: {
      beginner: 60,
      intermediate: 45,
      advanced: 30
    },
    calories: 80,
    est_publié: true
  }
];