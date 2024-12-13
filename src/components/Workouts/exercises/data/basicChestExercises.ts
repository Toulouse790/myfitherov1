import { Exercise } from '../types/exercise';

export const basicChestExercises: Exercise[] = [
  {
    id: "chest-1",
    name: "Développé couché",
    muscle_group: "pectoraux",
    muscleGroup: "pectoraux",
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
    id: "chest-2",
    name: "Développé incliné",
    muscleGroup: "pectoraux",
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
  },
  {
    id: "chest-3",
    name: "Développé décliné",
    muscleGroup: "pectoraux",
    description: "Cible la partie inférieure des pectoraux",
    difficulty: ["intermediate"],
    equipment: "Banc décliné, Barre, Poids",
    location: ["gym"],
    image_url: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Installez-vous sur un banc décliné",
      "Saisissez la barre avec une prise légèrement plus large que les épaules",
      "Descendez la barre vers le bas de la poitrine",
      "Poussez la barre vers le haut"
    ],
    targetMuscles: ["pectoraux inférieurs", "deltoïdes antérieurs", "triceps"],
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
  },
  {
    id: "chest-4",
    name: "Écarté avec haltères",
    muscleGroup: "pectoraux",
    description: "Excellent exercice d'isolation pour les pectoraux",
    difficulty: ["intermediate"],
    equipment: "Banc, Haltères",
    location: ["gym"],
    image_url: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Allongez-vous sur un banc plat",
      "Tenez les haltères au-dessus de la poitrine",
      "Écartez les bras en gardant un léger pli aux coudes",
      "Ramenez les haltères en position initiale"
    ],
    targetMuscles: ["pectoraux", "deltoïdes antérieurs"],
    objectives: ["muscle_gain", "maintenance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
    },
    reps: {
      beginner: 10,
      intermediate: 12,
      advanced: 15
    },
    restTime: {
      beginner: 90,
      intermediate: 60,
      advanced: 45
    },
    calories: 100
  },
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
    difficulty: ["intermediate"],
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
