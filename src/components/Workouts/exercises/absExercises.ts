import { Exercise } from '../types/exercise';

export const absExercises: Exercise[] = [
  {
    id: "abs-1",
    name: "Crunchs",
    muscleGroup: "abs",
    description: "Exercice de base pour les abdominaux",
    difficulty: "beginner",
    equipment: "Tapis",
    location: ["home", "outdoor", "gym"],
    instructions: [
      "Allongez-vous sur le dos, genoux fléchis",
      "Placez vos mains derrière la tête",
      "Soulevez les épaules du sol",
      "Revenez à la position initiale"
    ]
  },
  {
    id: "abs-2",
    name: "Planche",
    muscleGroup: "abs",
    description: "Excellent exercice statique pour le core",
    difficulty: "intermediate",
    equipment: "Aucun",
    location: ["home", "outdoor", "gym"],
    instructions: [
      "Placez-vous en position de pompe sur les avant-bras",
      "Gardez le corps parfaitement aligné",
      "Contractez les abdominaux",
      "Maintenez la position"
    ]
  },
  {
    id: "abs-3",
    name: "Relevé de jambes suspendu",
    muscleGroup: "abs",
    description: "Exercice avancé pour les abdominaux inférieurs",
    difficulty: "advanced",
    equipment: "Barre de traction",
    location: ["gym", "outdoor"],
    instructions: [
      "Suspendez-vous à la barre",
      "Gardez les jambes tendues",
      "Levez les jambes jusqu'à l'horizontale ou plus haut",
      "Descendez en contrôle"
    ]
  }
];