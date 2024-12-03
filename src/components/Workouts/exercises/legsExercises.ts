import { Exercise } from './types/exercise';

export const legsExercises: Exercise[] = [
  {
    id: "legs-1",
    name: "Squat",
    muscleGroup: "legs",
    description: "L'exercice roi pour les jambes",
    difficulty: "intermediate",
    equipment: "Barre et poids (optionnel)",
    location: ["gym", "home"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Pieds largeur d'épaules",
      "Descendez comme pour vous asseoir",
      "Gardez le dos droit",
      "Poussez sur les talons pour remonter"
    ],
    targetMuscles: ["quadriceps", "ischio-jambiers", "fessiers"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 5
    },
    reps: {
      beginner: 10,
      intermediate: 12,
      advanced: 15
    },
    calories: 150
  },
  {
    id: "legs-2",
    name: "Fentes avant",
    muscleGroup: "legs",
    description: "Excellent pour le travail unilatéral",
    difficulty: "beginner",
    equipment: "Haltères (optionnel)",
    location: ["gym", "home", "outdoor"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Faites un grand pas en avant",
      "Fléchissez les deux genoux à 90°",
      "Gardez le buste droit",
      "Poussez pour revenir"
    ],
    targetMuscles: ["quadriceps", "fessiers", "ischio-jambiers"],
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
    calories: 120
  },
  {
    id: "legs-3",
    name: "Extension des jambes",
    muscleGroup: "legs",
    description: "Isolation des quadriceps",
    difficulty: "beginner",
    equipment: "Machine à quadriceps",
    location: ["gym"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Asseyez-vous sur la machine",
      "Attrapez les poignées",
      "Tendez les jambes",
      "Contrôlez la descente"
    ],
    targetMuscles: ["quadriceps"],
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
    calories: 100
  },
  {
    id: "legs-4",
    name: "Soulevé de terre roumain",
    muscleGroup: "legs",
    description: "Excellent pour les ischio-jambiers",
    difficulty: "intermediate",
    equipment: "Barre ou haltères",
    location: ["gym", "home"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Debout, barre contre les cuisses",
      "Poussez les fesses en arrière",
      "Descendez en gardant le dos droit",
      "Remontez en contractant les ischio-jambiers"
    ],
    targetMuscles: ["ischio-jambiers", "fessiers", "lombaires"],
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
    calories: 130
  }
];