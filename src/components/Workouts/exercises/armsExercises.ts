import { Exercise } from '../types/exercise';

export const armsExercises: Exercise[] = [
  {
    id: "arms-1",
    name: "Curl biceps",
    muscleGroup: "arms",
    description: "L'exercice fondamental pour développer les biceps",
    difficulty: "beginner",
    equipment: "Haltères ou Barre",
    location: ["home", "gym"],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop",
    instructions: [
      "Debout, bras le long du corps",
      "Fléchissez les coudes pour monter les poids",
      "Contractez les biceps au sommet",
      "Descendez lentement en contrôlant le mouvement"
    ]
  },
  {
    id: "arms-2",
    name: "Extensions triceps à la poulie haute",
    muscleGroup: "arms",
    description: "Excellent exercice d'isolation pour les triceps",
    difficulty: "beginner",
    equipment: "Poulie haute",
    location: ["gym"],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop",
    instructions: [
      "Face à la poulie, coudes près du corps",
      "Tendez les bras vers le bas",
      "Ne bougez que les avant-bras",
      "Remontez lentement"
    ]
  },
  {
    id: "arms-3",
    name: "Curl marteau",
    muscleGroup: "arms",
    description: "Variante du curl ciblant le brachial et le long chef du biceps",
    difficulty: "beginner",
    equipment: "Haltères",
    location: ["home", "gym"],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop",
    instructions: [
      "Debout, haltères en pronation",
      "Montez les poids en gardant les paumes face à face",
      "Contractez au sommet",
      "Descendez en contrôlant"
    ]
  },
  {
    id: "arms-4",
    name: "Dips",
    muscleGroup: "arms",
    description: "Excellent exercice composé pour les triceps",
    difficulty: "intermediate",
    equipment: "Barres parallèles",
    location: ["gym"],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop",
    instructions: [
      "En appui sur les barres",
      "Fléchissez les coudes pour descendre",
      "Poussez pour remonter",
      "Gardez le buste droit ou légèrement penché"
    ]
  }
];