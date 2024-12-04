import { Exercise } from './types/exercise';

export const legsExercises: Exercise[] = [
  {
    id: "legs-1",
    name: "Squat poids de corps",
    muscleGroup: "legs",
    description: "Exercice complet pour les jambes sans équipement",
    difficulty: "beginner",
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Pieds largeur d'épaules",
      "Descendez comme pour vous asseoir",
      "Gardez le dos droit",
      "Poussez sur les talons pour remonter"
    ],
    targetMuscles: ["quadriceps", "ischio-jambiers", "fessiers"],
    objectives: ["endurance", "weight_loss", "maintenance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 5
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
    calories: 100
  },
  {
    id: "legs-2",
    name: "Squat avec barre",
    muscleGroup: "legs",
    description: "L'exercice roi pour la prise de masse des jambes",
    difficulty: "intermediate",
    equipment: "Barre et poids",
    location: ["gym"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Placez la barre sur vos trapèzes",
      "Pieds largeur d'épaules",
      "Descendez en gardant le dos droit",
      "Poussez à travers vos talons"
    ],
    targetMuscles: ["quadriceps", "ischio-jambiers", "fessiers", "lombaires"],
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
      advanced: 75
    },
    calories: 150
  },
  {
    id: "legs-3",
    name: "Fentes marchées",
    muscleGroup: "legs",
    description: "Excellent pour le travail unilatéral et l'équilibre",
    difficulty: "beginner",
    equipment: "Aucun (ou haltères optionnels)",
    location: ["home", "outdoor", "gym"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Faites un grand pas en avant",
      "Descendez le genou arrière vers le sol",
      "Poussez sur la jambe avant pour remonter",
      "Alternez les jambes en avançant"
    ],
    targetMuscles: ["quadriceps", "fessiers", "ischio-jambiers"],
    objectives: ["endurance", "weight_loss", "maintenance"],
    sets: {
      beginner: 2,
      intermediate: 3,
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