import { Exercise } from './types/exercise';

export const legsExercises: Exercise[] = [
  {
    id: "legs-1",
    name: "Squat avec barre",
    muscle_group: "legs",
    muscleGroup: "legs",
    description: "L'exercice roi pour la prise de masse des jambes",
    difficulty: ["intermediate"],
    equipment: "Barre et poids",
    location: ["gym"],
    image_url: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
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
    id: "legs-2",
    name: "Fentes avant",
    muscle_group: "legs",
    muscleGroup: "legs",
    description: "Excellent pour le développement unilatéral des jambes",
    difficulty: ["beginner"],
    equipment: "Haltères (optionnel)",
    location: ["home", "outdoor", "gym"],
    image_url: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Position debout, pieds joints",
      "Faites un grand pas en avant",
      "Descendez jusqu'à ce que le genou arrière touche presque le sol",
      "Poussez pour revenir à la position initiale"
    ],
    targetMuscles: ["quadriceps", "fessiers", "ischio-jambiers"],
    objectives: ["muscle_gain", "endurance"],
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
    calories: 130
  }
];