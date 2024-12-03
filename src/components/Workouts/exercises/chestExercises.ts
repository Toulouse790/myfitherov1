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
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1598971639058-999f3bfbfb09?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    instructions: [
      "Formez un diamant avec vos mains sous votre poitrine",
      "Gardez les coudes près du corps",
      "Descendez en contrôle",
      "Poussez pour remonter"
    ]
  },
  {
    id: "chest-4",
    name: "Dips pour pectoraux",
    muscleGroup: "chest",
    description: "Excellent exercice pour le bas des pectoraux",
    difficulty: "advanced",
    equipment: "Barres parallèles",
    location: ["gym"],
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&h=600&fit=crop",
    instructions: [
      "Positionnez-vous sur les barres parallèles",
      "Penchez-vous légèrement vers l'avant",
      "Descendez en fléchissant les coudes",
      "Poussez pour remonter"
    ]
  }
];