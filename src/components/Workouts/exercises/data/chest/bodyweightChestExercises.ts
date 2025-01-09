import { Exercise } from '../../types/exercise';

export const bodyweightChestExercises: Exercise[] = [
  {
    id: "chest_5",
    name: "Pompes",
    muscle_group: "chest",
    muscleGroup: "chest",
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
    calories: 80,
    est_publié: true
  }
];