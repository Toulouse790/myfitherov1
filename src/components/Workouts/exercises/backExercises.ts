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
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Saisissez la barre avec une prise plus large que les épaules",
      "Tirez votre corps vers le haut jusqu'à ce que votre menton dépasse la barre",
      "Descendez de manière contrôlée",
      "Répétez le mouvement"
    ],
    targetMuscles: ["grand dorsal", "rhomboïdes", "trapèzes", "biceps"],
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
    calories: 150
  },
  {
    id: "back-2",
    name: "Rowing barre",
    muscleGroup: "back",
    description: "Exercice complet pour le dos",
    difficulty: "intermediate",
    equipment: "Barre, Poids",
    location: ["gym"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Penchez-vous en avant avec le dos droit",
      "Saisissez la barre",
      "Tirez la barre vers votre abdomen",
      "Revenez à la position initiale de manière contrôlée"
    ],
    targetMuscles: ["grand dorsal", "trapèzes", "rhomboïdes", "biceps"],
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
    calories: 140
  },
  {
    id: "back-3",
    name: "Tirage vertical",
    muscleGroup: "back",
    description: "Excellent exercice pour la largeur du dos",
    difficulty: "beginner",
    equipment: "Machine de tirage vertical",
    location: ["gym"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Asseyez-vous à la machine, réglez les cuisses",
      "Saisissez la barre large au-dessus de votre tête",
      "Tirez la barre vers votre poitrine en serrant les omoplates",
      "Remontez lentement"
    ],
    targetMuscles: ["grand dorsal", "rhomboïdes", "biceps"],
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
  },
  {
    id: "back-4",
    name: "Rowing un bras",
    muscleGroup: "back",
    description: "Exercice unilatéral pour le dos",
    difficulty: "beginner",
    equipment: "Haltère, Banc",
    location: ["gym", "home"],
    image: "/lovable-uploads/d11ce5d6-3770-4313-bef4-0c19f1a205f7.png",
    instructions: [
      "Un genou et une main sur le banc",
      "Haltère dans l'autre main",
      "Tirez l'haltère vers la hanche",
      "Contrôlez la descente"
    ],
    targetMuscles: ["grand dorsal", "trapèzes", "rhomboïdes"],
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
    calories: 100
  }
];