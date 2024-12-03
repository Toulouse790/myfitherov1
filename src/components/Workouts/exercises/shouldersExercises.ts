import { Exercise } from './types/exercise';

export const shouldersExercises: Exercise[] = [
  {
    id: "shoulders-1",
    name: "Développé militaire",
    muscleGroup: "shoulders",
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
    calories: 130
  },
  {
    id: "shoulders-2",
    name: "Élévations latérales",
    muscleGroup: "shoulders",
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
    id: "shoulders-3",
    name: "Élévations frontales",
    muscleGroup: "shoulders",
    description: "Cible les deltoïdes antérieurs",
    difficulty: "beginner",
    equipment: "Haltères",
    location: ["gym", "home"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Debout, haltères devant les cuisses",
      "Levez les bras devant vous",
      "Montez jusqu'à l'horizontale",
      "Descendez lentement"
    ],
    targetMuscles: ["deltoïdes antérieurs"],
    sets: {
      beginner: 3,
      intermediate: 3,
      advanced: 4
    },
    reps: {
      beginner: 12,
      intermediate: 15,
      advanced: 15
    },
    calories: 90
  },
  {
    id: "shoulders-4",
    name: "Oiseau",
    muscleGroup: "shoulders",
    description: "Cible les deltoïdes postérieurs",
    difficulty: "beginner",
    equipment: "Haltères",
    location: ["gym", "home"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Penché en avant, dos droit",
      "Bras légèrement fléchis",
      "Écartez les bras sur les côtés",
      "Contrôlez le retour"
    ],
    targetMuscles: ["deltoïdes postérieurs", "trapèzes"],
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
    calories: 90
  }
];