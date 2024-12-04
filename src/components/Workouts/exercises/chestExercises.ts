import { Exercise } from './types/exercise';

export const chestExercises: Exercise[] = [
  {
    id: "chest-1",
    name: "Développé couché",
    muscleGroup: "poitrine",
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
    name: "Pompes classiques",
    muscleGroup: "poitrine",
    description: "Exercice de base pour les pectoraux sans matériel",
    difficulty: "beginner",
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    image: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Position de planche, mains largeur d'épaules",
      "Descendez le corps en gardant une ligne droite",
      "Poussez pour revenir à la position initiale"
    ],
    targetMuscles: ["pectoraux", "deltoïdes", "triceps"],
    objectives: ["muscle_gain", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 5
    },
    reps: {
      beginner: 8,
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
    id: "chest-3",
    name: "Développé incliné haltères",
    muscleGroup: "poitrine",
    description: "Cible la partie supérieure des pectoraux",
    difficulty: "intermediate",
    equipment: "Banc incliné, Haltères",
    location: ["gym"],
    image: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Position assise sur banc incliné",
      "Haltères au niveau des épaules",
      "Poussez vers le haut",
      "Contrôlez la descente"
    ],
    targetMuscles: ["pectoraux supérieurs", "deltoïdes", "triceps"],
    objectives: ["muscle_gain"],
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
      intermediate: 75,
      advanced: 60
    },
    calories: 130
  },
  {
    id: "chest-4",
    name: "Pompes diamant",
    muscleGroup: "poitrine",
    description: "Variante des pompes ciblant les triceps et le centre des pectoraux",
    difficulty: "intermediate",
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    image: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Mains en forme de diamant sous la poitrine",
      "Gardez les coudes près du corps",
      "Descendez en contrôlant le mouvement",
      "Poussez pour remonter"
    ],
    targetMuscles: ["pectoraux", "triceps"],
    objectives: ["muscle_gain", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
    },
    reps: {
      beginner: 8,
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
    name: "Écarté avec haltères",
    muscleGroup: "poitrine",
    description: "Isolation des pectoraux",
    difficulty: "intermediate",
    equipment: "Banc, Haltères",
    location: ["gym"],
    image: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Allongé sur un banc plat",
      "Bras tendus à la verticale",
      "Descendez les bras sur les côtés",
      "Remontez en contractant les pectoraux"
    ],
    targetMuscles: ["pectoraux"],
    objectives: ["muscle_gain"],
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
    calories: 120
  }
];