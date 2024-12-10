import { Exercise } from './types/exercise';

export const absExercises: Exercise[] = [
  {
    id: "abs-1",
    name: "Crunch",
    muscleGroup: "abdominaux",
    description: "Exercice de base pour les abdominaux",
    difficulty: "beginner",
    equipment: "Tapis",
    location: ["home", "gym", "outdoor"],
    image_url: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
    instructions: [
      "Allongé sur le dos, genoux fléchis",
      "Mains derrière la tête",
      "Décollez les épaules du sol",
      "Revenez lentement"
    ],
    targetMuscles: ["grand droit", "obliques"],
    objectives: ["weight_loss", "endurance", "maintenance"],
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
    calories: 80
  },
  {
    id: "abs-2",
    name: "Planche",
    muscleGroup: "abdominaux",
    description: "Excellent pour la sangle abdominale",
    difficulty: "intermediate",
    equipment: "Aucun",
    location: ["home", "gym", "outdoor"],
    image_url: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
    instructions: [
      "En appui sur les avant-bras",
      "Corps aligné",
      "Contractez les abdominaux",
      "Maintenez la position"
    ],
    targetMuscles: ["abdominaux", "transverse", "lombaires"],
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
    name: "Relevé de jambes",
    muscleGroup: "abdominaux",
    description: "Cible les abdominaux inférieurs",
    difficulty: "intermediate",
    equipment: "Aucun",
    location: ["home", "gym", "outdoor"],
    image_url: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
    instructions: [
      "Allongé sur le dos",
      "Jambes tendues",
      "Levez les jambes à 90 degrés",
      "Redescendez lentement"
    ],
    targetMuscles: ["abdominaux inférieurs"],
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
    muscleGroup: "abdominaux",
    description: "Excellent pour les obliques",
    difficulty: "intermediate",
    equipment: "Poids (optionnel)",
    location: ["home", "gym", "outdoor"],
    image_url: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
    instructions: [
      "Assis, genoux pliés",
      "Penchez-vous légèrement en arrière",
      "Tournez le torse d'un côté à l'autre",
      "Gardez les abdominaux contractés"
    ],
    targetMuscles: ["obliques", "abdominaux"],
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
    muscleGroup: "abdominaux",
    description: "Excellent exercice cardio-abdominal",
    difficulty: "intermediate",
    equipment: "Aucun",
    location: ["home", "gym", "outdoor"],
    image_url: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
    instructions: [
      "Position de planche",
      "Ramenez alternativement les genoux vers la poitrine",
      "Gardez le dos droit",
      "Maintenez un rythme rapide"
    ],
    targetMuscles: ["abdominaux", "obliques"],
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
