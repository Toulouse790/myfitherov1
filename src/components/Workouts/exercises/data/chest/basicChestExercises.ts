import { Exercise } from '../../types/exercise';

export const basicChestExercises: Exercise[] = [
  {
    id: "chest_1",
    name: "Développé couché",
    muscle_group: "chest",
    muscleGroup: "chest",
    description: "Exercice fondamental pour les pectoraux",
    difficulty: ["beginner"],
    equipment: "Banc plat, Barre, Poids",
    location: ["gym"],
    image_url: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Allongez-vous sur un banc plat",
      "Saisissez la barre avec une prise légèrement plus large que les épaules",
      "Descendez la barre jusqu'à la poitrine",
      "Poussez la barre vers le haut"
    ],
    targetMuscles: ["pectoraux", "deltoïdes antérieurs", "triceps"],
    objectives: ["muscle_gain", "maintenance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
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
    calories: 150
  }
];