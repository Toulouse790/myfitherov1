import { Exercise } from './types/exercise';

export const backExercises: Exercise[] = [
  {
    id: "back-1",
    name: "Tractions",
    muscle_group: "back",
    muscleGroup: "back",
    description: "Exercice fondamental pour le dos",
    difficulty: ["intermediate"],
    equipment: "Barre de traction",
    location: ["gym", "outdoor"],
    image_url: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Saisissez la barre en pronation",
      "Tirez-vous vers le haut",
      "Descendez de manière contrôlée",
      "Répétez le mouvement"
    ],
    targetMuscles: ["dorsaux", "biceps", "avant-bras"],
    objectives: ["muscle_gain", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 5
    },
    reps: {
      beginner: 5,
      intermediate: 8,
      advanced: 12
    },
    restTime: {
      beginner: 120,
      intermediate: 90,
      advanced: 60
    },
    calories: 150
  }
];