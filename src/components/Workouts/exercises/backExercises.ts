import { Exercise } from './types/exercise';

export const backExercises: Exercise[] = [
  {
    id: "back-1",
    name: "Tractions",
    muscleGroup: "back",
    description: "Excellent exercice pour le développement du dos",
    difficulty: "intermediate",
    equipment: "Barre de traction",
    location: ["gym", "outdoor"],
    image: "/lovable-uploads/257202c1-1845-4cf0-b979-a3505069c9e7.png",
    instructions: [
      "Saisissez la barre avec une prise plus large que les épaules",
      "Tirez votre corps vers le haut jusqu'à ce que votre menton dépasse la barre",
      "Descendez de manière contrôlée",
      "Répétez le mouvement"
    ],
    targetMuscles: ["grand dorsal", "rhomboïdes", "trapèzes", "biceps"],
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
    calories: 200 // Mise à jour des calories
  },
  {
    id: "back-2",
    name: "Rowing barre",
    muscleGroup: "back",
    description: "Exercice complet pour le dos",
    difficulty: "intermediate",
    equipment: "Barre, Poids",
    location: ["gym"],
    image: "/lovable-uploads/257202c1-1845-4cf0-b979-a3505069c9e7.png",
    instructions: [
      "Penchez-vous en avant avec le dos droit",
      "Saisissez la barre",
      "Tirez la barre vers votre abdomen",
      "Revenez à la position initiale de manière contrôlée"
    ],
    targetMuscles: ["grand dorsal", "trapèzes", "rhomboïdes", "biceps"],
    objectives: ["muscle_gain", "endurance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
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
    calories: 180 // Mise à jour des calories
  },
  {
    id: "back-3",
    name: "Tirage vertical",
    muscleGroup: "back",
    description: "Excellent exercice pour la largeur du dos",
    difficulty: "beginner",
    equipment: "Machine de tirage vertical",
    location: ["gym"],
    image: "/lovable-uploads/257202c1-1845-4cf0-b979-a3505069c9e7.png",
    instructions: [
      "Asseyez-vous à la machine, réglez les cuisses",
      "Saisissez la barre large au-dessus de votre tête",
      "Tirez la barre vers votre poitrine en serrant les omoplates",
      "Remontez lentement"
    ],
    targetMuscles: ["grand dorsal", "rhomboïdes", "biceps"],
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
    calories: 160 // Mise à jour des calories
  }
];