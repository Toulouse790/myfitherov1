import { Exercise } from './types/exercise';

export const absExercises: Exercise[] = [
  {
    id: "abs-1",
    name: "Crunch",
    muscleGroup: "abs",
    description: "Exercice de base pour les abdominaux",
    difficulty: "beginner",
    equipment: "Tapis",
    location: ["home", "gym", "outdoor"],
    image: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
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
    muscleGroup: "abs",
    description: "Excellent pour la sangle abdominale",
    difficulty: "intermediate",
    equipment: "Aucun",
    location: ["home", "gym", "outdoor"],
    image: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
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
    muscleGroup: "abs",
    description: "Cible les abdominaux inférieurs",
    difficulty: "intermediate",
    equipment: "Barre fixe ou tapis",
    location: ["gym", "home"],
    image: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
    instructions: [
      "Allongé sur le dos",
      "Jambes tendues",
      "Levez les jambes à 90°",
      "Descendez lentement"
    ],
    targetMuscles: ["abdominaux inférieurs", "psoas"],
    objectives: ["weight_loss", "muscle_gain"],
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
    muscleGroup: "abs",
    description: "Excellent pour les obliques",
    difficulty: "intermediate",
    equipment: "Poids (optionnel)",
    location: ["home", "gym"],
    image: "/lovable-uploads/5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png",
    instructions: [
      "Assis, genoux fléchis",
      "Buste incliné en arrière",
      "Tournez le buste d'un côté à l'autre",
      "Gardez les abdominaux contractés"
    ],
    targetMuscles: ["obliques", "grand droit"],
    objectives: ["weight_loss", "endurance"],
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
    calories: 85
  }
];