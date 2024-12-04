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
    muscleGroup: "abdominaux",
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
  }
];