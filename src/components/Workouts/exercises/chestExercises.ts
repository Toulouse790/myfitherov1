import { Exercise } from '../types/exercise';

export const chestExercises: Exercise[] = [
  {
    id: "chest-1",
    name: "Développé couché",
    muscleGroup: "chest",
    description: "Un exercice fondamental pour le développement des pectoraux",
    difficulty: "intermediate",
    equipment: "Banc, Barre, Poids",
    location: ["gym"],
    instructions: [
      "Allongez-vous sur le banc",
      "Saisissez la barre avec une prise légèrement plus large que les épaules",
      "Descendez la barre jusqu'à la poitrine",
      "Poussez la barre vers le haut"
    ]
  },
  {
    id: "chest-2",
    name: "Pompes",
    muscleGroup: "chest",
    description: "Un exercice de poids de corps classique pour les pectoraux",
    difficulty: "beginner",
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    instructions: [
      "Placez vos mains légèrement plus larges que vos épaules",
      "Gardez votre corps droit",
      "Descendez votre poitrine près du sol",
      "Poussez pour revenir à la position initiale"
    ]
  },
  {
    id: "chest-3",
    name: "Pompes diamant",
    muscleGroup: "chest",
    description: "Variation des pompes ciblant plus les triceps",
    difficulty: "intermediate",
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    instructions: [
      "Formez un diamant avec vos mains sous votre poitrine",
      "Gardez les coudes près du corps",
      "Descendez en contrôle",
      "Poussez pour remonter"
    ]
  }
];