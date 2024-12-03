import { Exercise } from '../types/exercise';

export const absExercises: Exercise[] = [
  {
    id: "abs-1",
    name: "Crunchs",
    muscleGroup: "abs",
    description: "Exercice de base pour renforcer les abdominaux supérieurs",
    difficulty: "beginner",
    equipment: "Tapis",
    location: ["home", "outdoor", "gym"],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    instructions: [
      "Allongé sur le dos, genoux fléchis",
      "Mains derrière la tête, coudes écartés",
      "Décollez les épaules en contractant les abdominaux",
      "Revenez contrôlez à la position initiale"
    ]
  },
  {
    id: "abs-2",
    name: "Planche",
    muscleGroup: "abs",
    description: "Excellent exercice statique pour renforcer l'ensemble de la sangle abdominale",
    difficulty: "intermediate",
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    instructions: [
      "En appui sur les avant-bras et la pointe des pieds",
      "Corps parfaitement aligné",
      "Contractez les abdominaux et les fessiers",
      "Maintenez la position le temps indiqué"
    ]
  },
  {
    id: "abs-3",
    name: "Mountain Climbers",
    muscleGroup: "abs",
    description: "Exercice dynamique qui sollicite les abdominaux tout en travaillant le cardio",
    difficulty: "intermediate",
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    instructions: [
      "Position de planche sur les mains",
      "Ramenez alternativement les genoux vers la poitrine",
      "Gardez le dos droit",
      "Maintenez un rythme soutenu"
    ]
  },
  {
    id: "abs-4",
    name: "Relevés de jambes suspendu",
    muscleGroup: "abs",
    description: "Exercice avancé ciblant particulièrement les abdominaux inférieurs",
    difficulty: "advanced",
    equipment: "Barre de traction",
    location: ["gym"],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    instructions: [
      "Suspendez-vous à la barre",
      "Jambes tendues, levez-les jusqu'à l'horizontale",
      "Contrôlez la descente",
      "Évitez le balancement"
    ]
  }
];