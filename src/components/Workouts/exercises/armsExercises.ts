import { Exercise } from './types/exercise';

export const armsExercises: Exercise[] = [
  {
    id: "arms-1",
    name: "Curl biceps",
    muscle_group: "arms",
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
    muscle_group: "arms",
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
  }
];