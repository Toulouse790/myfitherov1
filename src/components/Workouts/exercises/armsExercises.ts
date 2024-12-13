import { Exercise } from './types/exercise';

export const armsExercises: Exercise[] = [
  {
    id: "arms-1",
    name: "Curl biceps",
    muscleGroup: "arms",
    description: "L'exercice fondamental pour les biceps",
    difficulty: ["beginner"],
    equipment: "Haltères ou Barre",
    location: ["gym", "home"],
    image_url: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Debout, bras le long du corps",
      "Montez les poids en fléchissant les coudes",
      "Contractez les biceps au sommet",
      "Descendez lentement"
    ],
    targetMuscles: ["biceps", "avant-bras"],
    objectives: ["muscle_gain", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
    },
    reps: {
      beginner: 12,
      intermediate: 15,
      advanced: 18
    },
    restTime: {
      beginner: 90,
      intermediate: 60,
      advanced: 45
    },
    calories: 150
  },
  {
    id: "arms-2",
    name: "Extension triceps à la poulie",
    muscleGroup: "arms",
    description: "Excellent exercice d'isolation pour les triceps",
    difficulty: ["beginner"],
    equipment: "Poulie haute",
    location: ["gym"],
    image_url: "/lovable-uploads/09ce8973-60de-4f3f-9825-a7e506fd2814.png",
    instructions: [
      "Face à la poulie, coudes près du corps",
      "Tendez les bras vers le bas",
      "Ne bougez que les avant-bras",
      "Remontez lentement"
    ],
    targetMuscles: ["triceps"],
    objectives: ["muscle_gain", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
    },
    reps: {
      beginner: 12,
      intermediate: 15,
      advanced: 20
    },
    restTime: {
      beginner: 90,
      intermediate: 60,
      advanced: 45
    },
    calories: 130
  },
  {
    id: "arms-3",
    name: "Curl marteau",
    muscleGroup: "arms",
    description: "Variante du curl ciblant le brachial",
    difficulty: ["beginner"],
    equipment: "Haltères",
    location: ["gym", "home"],
    image_url: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Debout, haltères en pronation",
      "Montez les poids en gardant les paumes face à face",
      "Contractez au sommet",
      "Descendez en contrôlant"
    ],
    targetMuscles: ["biceps", "brachial", "avant-bras"],
    objectives: ["muscle_gain", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
    },
    reps: {
      beginner: 12,
      intermediate: 15,
      advanced: 18
    },
    restTime: {
      beginner: 90,
      intermediate: 60,
      advanced: 45
    },
    calories: 140
  },
  {
    id: "arms-4",
    name: "Dips",
    muscleGroup: "arms",
    description: "Excellent exercice composé pour les triceps",
    difficulty: ["intermediate"],
    equipment: "Barres parallèles ou chaise",
    location: ["gym", "home"],
    image_url: "/lovable-uploads/09ce8973-60de-4f3f-9825-a7e506fd2814.png",
    instructions: [
      "En appui sur les barres",
      "Descendez en pliant les coudes",
      "Poussez pour remonter",
      "Gardez le buste droit"
    ],
    targetMuscles: ["triceps", "pectoraux", "épaules"],
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
    calories: 160
  },
  {
    id: "arms-5",
    name: "Pompes diamant",
    muscleGroup: "arms",
    description: "Excellent exercice pour les triceps sans matériel",
    difficulty: ["intermediate"],
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    image_url: "/lovable-uploads/09ce8973-60de-4f3f-9825-a7e506fd2814.png",
    instructions: [
      "Mains en forme de diamant sous la poitrine",
      "Descendez en pliant les coudes",
      "Poussez pour remonter",
      "Gardez les coudes près du corps"
    ],
    targetMuscles: ["triceps", "pectoraux"],
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
    calories: 120
  }
];
