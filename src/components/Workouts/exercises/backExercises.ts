import { Exercise } from './types/exercise';

export const backExercises: Exercise[] = [
  {
    id: "back-1",
    name: "Tractions",
    muscleGroup: "dos",
    description: "Excellent exercice pour le développement du dos",
    difficulty: "intermediate",
    equipment: "Barre de traction",
    location: ["gym", "outdoor"],
    image_url: "/lovable-uploads/257202c1-1845-4cf0-b979-a3505069c9e7.png",
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
    calories: 200
  },
  {
    id: "back-2",
    name: "Rowing barre",
    muscleGroup: "dos",
    description: "Exercice complet pour le dos",
    difficulty: "intermediate",
    equipment: "Barre, Poids",
    location: ["gym"],
    image_url: "/lovable-uploads/257202c1-1845-4cf0-b979-a3505069c9e7.png",
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
    calories: 180
  },
  {
    id: "back-3",
    name: "Rowing haltère un bras",
    muscleGroup: "dos",
    description: "Excellent pour travailler chaque côté indépendamment",
    difficulty: "beginner",
    equipment: "Haltère, Banc",
    location: ["gym", "home"],
    image_url: "/lovable-uploads/257202c1-1845-4cf0-b979-a3505069c9e7.png",
    instructions: [
      "Un genou et une main sur le banc",
      "Haltère dans l'autre main",
      "Tirez l'haltère vers la hanche",
      "Contrôlez la descente"
    ],
    targetMuscles: ["grand dorsal", "trapèzes", "rhomboïdes"],
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
    calories: 150
  },
  {
    id: "back-4",
    name: "Tirage vertical",
    muscleGroup: "dos",
    description: "Excellent pour la largeur du dos",
    difficulty: "beginner",
    equipment: "Machine de tirage",
    location: ["gym"],
    image_url: "/lovable-uploads/257202c1-1845-4cf0-b979-a3505069c9e7.png",
    instructions: [
      "Assis face à la machine",
      "Saisissez la barre large",
      "Tirez vers la poitrine",
      "Remontez lentement"
    ],
    targetMuscles: ["grand dorsal", "rhomboïdes"],
    objectives: ["muscle_gain"],
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
    calories: 160
  },
  {
    id: "back-5",
    name: "Extensions au sol",
    muscleGroup: "dos",
    description: "Excellent pour le bas du dos",
    difficulty: "beginner",
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    image_url: "/lovable-uploads/257202c1-1845-4cf0-b979-a3505069c9e7.png",
    instructions: [
      "Allongé sur le ventre",
      "Mains derrière la tête",
      "Soulevez le haut du corps",
      "Revenez doucement"
    ],
    targetMuscles: ["lombaires", "érecteurs du rachis"],
    objectives: ["muscle_gain", "maintenance"],
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
