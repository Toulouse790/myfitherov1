import { Exercise } from './types/exercise';

export const armsExercises: Exercise[] = [
  {
    id: "arms-1",
    name: "Curl biceps",
    muscleGroup: "arms",
    description: "L'exercice fondamental pour les biceps",
    difficulty: "beginner",
    equipment: "Haltères ou Barre",
    location: ["gym", "home"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Debout, bras le long du corps",
      "Montez les poids en fléchissant les coudes",
      "Contractez les biceps au sommet",
      "Descendez lentement"
    ],
    targetMuscles: ["biceps", "avant-bras"],
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
    calories: 100
  },
  {
    id: "arms-2",
    name: "Extension triceps à la poulie",
    muscleGroup: "arms",
    description: "Excellent exercice d'isolation pour les triceps",
    difficulty: "beginner",
    equipment: "Poulie haute",
    location: ["gym"],
    image: "/lovable-uploads/09ce8973-60de-4f3f-9825-a7e506fd2814.png",
    instructions: [
      "Face à la poulie, coudes près du corps",
      "Tendez les bras vers le bas",
      "Ne bougez que les avant-bras",
      "Remontez lentement"
    ],
    targetMuscles: ["triceps"],
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
    calories: 90
  },
  {
    id: "arms-3",
    name: "Curl marteau",
    muscleGroup: "arms",
    description: "Variante du curl ciblant le brachial",
    difficulty: "beginner",
    equipment: "Haltères",
    location: ["gym", "home"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Debout, haltères en pronation",
      "Montez les poids en gardant les paumes face à face",
      "Contractez au sommet",
      "Descendez en contrôlant"
    ],
    targetMuscles: ["biceps", "brachial", "avant-bras"],
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
    calories: 95
  },
  {
    id: "arms-4",
    name: "Extension triceps au-dessus de la tête",
    muscleGroup: "arms",
    description: "Excellent pour la masse des triceps",
    difficulty: "intermediate",
    equipment: "Haltère",
    location: ["gym", "home"],
    image: "/lovable-uploads/09ce8973-60de-4f3f-9825-a7e506fd2814.png",
    instructions: [
      "Assis ou debout, haltère au-dessus de la tête",
      "Descendez l'haltère derrière la tête",
      "Gardez les coudes près des oreilles",
      "Tendez les bras"
    ],
    targetMuscles: ["triceps"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
    },
    reps: {
      beginner: 12,
      intermediate: 15,
      advanced: 15
    },
    calories: 85
  }
];