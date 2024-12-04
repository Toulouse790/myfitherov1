import { Exercise } from './types/exercise';

export const shouldersExercises: Exercise[] = [
  {
    id: "shoulders-1",
    name: "Développé militaire",
    muscleGroup: "épaules",
    description: "Exercice fondamental pour les épaules",
    difficulty: "intermediate",
    equipment: "Barre ou Haltères",
    location: ["gym"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Debout ou assis, dos droit",
      "Barre au niveau des clavicules",
      "Poussez au-dessus de la tête",
      "Contrôlez la descente"
    ],
    targetMuscles: ["deltoïdes", "trapèzes", "triceps"],
    objectives: ["muscle_gain", "endurance"],
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
    calories: 170
  },
  {
    id: "shoulders-2",
    name: "Élévations latérales",
    muscleGroup: "épaules",
    description: "Isolation des deltoïdes moyens",
    difficulty: "beginner",
    equipment: "Haltères",
    location: ["gym", "home"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Debout, haltères le long du corps",
      "Levez les bras sur les côtés",
      "Gardez une légère flexion des coudes",
      "Descendez lentement"
    ],
    targetMuscles: ["deltoïdes moyens"],
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
  }
];