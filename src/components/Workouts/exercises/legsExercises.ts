import { Exercise } from './types/exercise';

export const legsExercises: Exercise[] = [
  {
    id: "legs-1",
    name: "Squat avec barre",
    muscleGroup: "jambes",
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
    id: "legs-2",
    name: "Presse à cuisses",
    muscleGroup: "jambes",
    description: "Excellent exercice pour développer la force des jambes",
    difficulty: "intermediate",
    equipment: "Machine presse à cuisses",
    location: ["gym"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Réglez le siège à la bonne hauteur",
      "Placez vos pieds largeur d'épaules sur la plateforme",
      "Poussez en gardant le bas du dos plaqué",
      "Contrôlez la descente"
    ],
    targetMuscles: ["quadriceps", "ischio-jambiers", "fessiers"],
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
  },
  {
    id: "legs-3",
    name: "Extension de jambes",
    muscleGroup: "jambes",
    description: "Isolation des quadriceps",
    difficulty: "beginner",
    equipment: "Machine à extension",
    location: ["gym"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Asseyez-vous sur la machine",
      "Ajustez le coussin sur vos chevilles",
      "Étendez complètement les jambes",
      "Revenez lentement à la position de départ"
    ],
    targetMuscles: ["quadriceps"],
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
      beginner: 60,
      intermediate: 45,
      advanced: 30
    },
    calories: 100
  }
];