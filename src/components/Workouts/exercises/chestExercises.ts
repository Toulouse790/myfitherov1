import { Exercise } from './types/exercise';

export const chestExercises: Exercise[] = [
  {
    id: "chest-1",
    name: "Développé couché",
    muscleGroup: "chest",
    description: "Un exercice fondamental pour le développement des pectoraux",
    difficulty: "intermediate",
    equipment: "Banc, Barre, Poids",
    location: ["gym"],
    image: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
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
    id: "chest-2",
    name: "Pompes",
    muscleGroup: "chest",
    description: "Un exercice de poids de corps classique pour les pectoraux",
    difficulty: "beginner",
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    image: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Placez vos mains légèrement plus larges que vos épaules",
      "Gardez votre corps droit",
      "Descendez votre poitrine près du sol",
      "Poussez pour revenir à la position initiale"
    ],
    targetMuscles: ["pectoraux", "deltoïdes", "triceps", "core"],
    objectives: ["muscle_gain", "endurance", "weight_loss"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 5
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
    calories: 100
  },
  {
    id: "chest-3",
    name: "Développé incliné haltères",
    muscleGroup: "chest",
    description: "Excellent pour cibler la partie supérieure des pectoraux",
    difficulty: "intermediate",
    equipment: "Banc incliné, Haltères",
    location: ["gym"],
    image: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Installez-vous sur un banc incliné",
      "Tenez un haltère dans chaque main au niveau des épaules",
      "Poussez les haltères vers le haut",
      "Contrôlez la descente"
    ],
    targetMuscles: ["pectoraux supérieurs", "deltoïdes antérieurs", "triceps"],
    objectives: ["muscle_gain"],
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
    calories: 130
  }
];