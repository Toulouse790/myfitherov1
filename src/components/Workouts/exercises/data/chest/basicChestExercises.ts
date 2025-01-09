import { Exercise } from '../../types/exercise';

export const basicChestExercises: Exercise[] = [
  {
    id: "chest_1",
    name: "Développé couché",
    muscle_group: "chest",
    muscleGroup: "chest",
    description: "Un exercice fondamental pour le développement des pectoraux",
    difficulty: ["intermediate"],
    equipment: "Banc, Barre, Poids",
    location: ["gym"],
    image_url: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Allongez-vous sur le banc",
      "Saisissez la barre avec une prise légèrement plus large que les épaules",
      "Descendez la barre jusqu'à la poitrine",
      "Poussez la barre vers le haut"
    ],
    targetMuscles: ["pectoraux majeurs", "deltoïdes antérieurs", "triceps"],
    objectives: ["muscle_gain", "maintenance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 5
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
  },
  {
    id: "chest_2",
    name: "Développé incliné",
    muscle_group: "chest",
    muscleGroup: "chest",
    description: "Cible la partie supérieure des pectoraux",
    difficulty: ["intermediate"],
    equipment: "Banc incliné, Barre, Poids",
    location: ["gym"],
    image_url: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Réglez le banc à 30-45 degrés",
      "Saisissez la barre avec une prise légèrement plus large que les épaules",
      "Descendez la barre vers le haut de la poitrine",
      "Poussez la barre vers le haut"
    ],
    targetMuscles: ["pectoraux supérieurs", "deltoïdes antérieurs", "triceps"],
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
    calories: 140
  }
];