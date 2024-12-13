import { Exercise } from '../types/exercise';

export const bodyweightChestExercises: Exercise[] = [
  {
    id: "chest-5",
    name: "Pompes",
    muscleGroup: "pectoraux",
    description: "Exercice de base pour les pectoraux sans matériel",
    difficulty: ["beginner"],
    equipment: "Aucun",
    location: ["home", "gym", "outdoor"],
    image_url: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Position de planche, mains largeur d'épaules",
      "Gardez le corps aligné",
      "Descendez la poitrine près du sol",
      "Poussez pour revenir en position initiale"
    ],
    targetMuscles: ["pectoraux", "deltoïdes antérieurs", "triceps"],
    objectives: ["muscle_gain", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 5
    },
    reps: {
      beginner: 8,
      intermediate: 15,
      advanced: 20
    },
    restTime: {
      beginner: 90,
      intermediate: 60,
      advanced: 45
    },
    calories: 80
  },
  {
    id: "chest-6",
    name: "Dips",
    muscleGroup: "pectoraux",
    description: "Excellent exercice composé pour les pectoraux et triceps",
    difficulty: "intermediate",
    equipment: "Barres parallèles",
    location: ["gym"],
    image_url: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Saisissez les barres parallèles",
      "Penchez-vous légèrement vers l'avant",
      "Descendez en fléchissant les coudes",
      "Poussez pour revenir en position initiale"
    ],
    targetMuscles: ["pectoraux inférieurs", "triceps", "deltoïdes antérieurs"],
    objectives: ["muscle_gain", "maintenance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
    },
    reps: {
      beginner: 6,
      intermediate: 10,
      advanced: 15
    },
    restTime: {
      beginner: 120,
      intermediate: 90,
      advanced: 60
    },
    calories: 100
  }
];