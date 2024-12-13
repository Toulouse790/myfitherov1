import { Exercise } from './types/exercise';

export const shouldersExercises: Exercise[] = [
  {
    id: "shoulders-1",
    name: "Développé militaire",
    muscleGroup: "épaules",
    description: "Exercice fondamental pour les épaules",
    difficulty: ["intermediate"],
    equipment: "Barre ou Haltères",
    location: ["gym"],
    image_url: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
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
    image_url: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
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
  },
  {
    id: "shoulders-3",
    name: "Élévations frontales",
    muscleGroup: "épaules",
    description: "Cible les deltoïdes antérieurs",
    difficulty: "beginner",
    equipment: "Haltères",
    location: ["gym", "home"],
    image_url: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Debout, haltères devant les cuisses",
      "Levez les bras devant vous",
      "Montez jusqu'à l'horizontale",
      "Redescendez contrôlé"
    ],
    targetMuscles: ["deltoïdes antérieurs"],
    objectives: ["muscle_gain", "endurance"],
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
    restTime: {
      beginner: 90,
      intermediate: 60,
      advanced: 45
    },
    calories: 130
  },
  {
    id: "shoulders-4",
    name: "Pompes en pique",
    muscleGroup: "épaules",
    description: "Excellent exercice pour les épaules sans matériel",
    difficulty: "intermediate",
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    image_url: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Position de pompe, fesses vers le haut",
      "Tête vers le sol",
      "Descendez verticalement",
      "Poussez pour remonter"
    ],
    targetMuscles: ["deltoïdes", "trapèzes"],
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
  },
  {
    id: "shoulders-5",
    name: "Shrugs avec haltères",
    muscleGroup: "épaules",
    description: "Isolation des trapèzes",
    difficulty: "beginner",
    equipment: "Haltères",
    location: ["gym", "home"],
    image_url: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Debout, haltères le long du corps",
      "Haussez les épaules",
      "Maintenez la contraction",
      "Redescendez lentement"
    ],
    targetMuscles: ["trapèzes"],
    objectives: ["muscle_gain"],
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
      beginner: 60,
      intermediate: 45,
      advanced: 30
    },
    calories: 100
  }
];