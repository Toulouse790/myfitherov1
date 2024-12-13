import { Exercise } from '../../types/exercise';

export const dynamicAbsExercises: Exercise[] = [
  {
    id: "abs-5",
    name: "Mountain Climber",
    muscle_group: "abs",
    muscleGroup: "abs",
    description: "Great cardio-abdominal exercise",
    difficulty: ["intermediate"],
    equipment: "None",
    location: ["home", "gym", "outdoor"],
    image_url: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
    instructions: [
      "Start in a plank position",
      "Bring your knees alternately towards your chest",
      "Keep your back straight",
      "Maintain a fast pace"
    ],
    targetMuscles: ["abs", "obliques"],
    objectives: ["endurance", "weight_loss"],
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
    calories: 120
  }
];