import { Exercise } from './types/exercise';

export const cardioExercises: Exercise[] = [
  {
    id: "cardio-1",
    name: "Burpees",
    muscle_group: "cardio",
    muscleGroup: "cardio",
    description: "Exercice explosif complet pour le cardio",
    difficulty: ["intermediate"],
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    image_url: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
    instructions: [
      "Commencez debout",
      "Descendez en position de pompe",
      "Faites une pompe",
      "Ramenez les pieds et sautez"
    ],
    targetMuscles: ["full_body"],
    objectives: ["weight_loss", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 5
    },
    reps: {
      beginner: 8,
      intermediate: 12,
      advanced: 15
    },
    restTime: {
      beginner: 60,
      intermediate: 45,
      advanced: 30
    },
    calories: 200
  },
  {
    id: "cardio-2",
    name: "Mountain Climbers",
    muscle_group: "full_body",
    muscleGroup: "full_body",
    description: "Excellent exercice cardio qui cible aussi les abdominaux",
    difficulty: ["beginner"],
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    image_url: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
    instructions: [
      "Position de planche",
      "Ramenez alternativement les genoux vers la poitrine",
      "Gardez le dos droit",
      "Maintenez un rythme rapide"
    ],
    targetMuscles: ["abdominaux", "épaules", "hanches"],
    objectives: ["weight_loss", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
    },
    reps: {
      beginner: 20,
      intermediate: 30,
      advanced: 40
    },
    restTime: {
      beginner: 60,
      intermediate: 45,
      advanced: 30
    },
    calories: 150
  }
];