import { Exercise } from './types/exercise';

export const absExercises: Exercise[] = [
  {
    id: "abs-1",
    name: "Crunch",
    muscle_group: "abs",
    muscleGroup: "abs",
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
    is_published: true
  },
  {
    id: "abs-2",
    name: "Plank",
    muscle_group: "abs",
    muscleGroup: "abs",
    description: "Excellent for core stability",
    difficulty: ["intermediate"],
    equipment: "None",
    location: ["home", "gym", "outdoor"],
    image_url: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
    instructions: [
      "Support yourself on your forearms",
      "Keep your body aligned",
      "Engage your core",
      "Hold the position"
    ],
    targetMuscles: ["abdominals", "transverse", "lower back"],
    objectives: ["endurance", "maintenance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 5
    },
    reps: {
      beginner: 30,
      intermediate: 45,
      advanced: 60
    },
    restTime: {
      beginner: 60,
      intermediate: 45,
      advanced: 30
    },
    calories: 70
  },
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
  },
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
