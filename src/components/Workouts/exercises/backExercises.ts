import { Exercise } from '../types/exercise';

export const backExercises: Exercise[] = [
  {
    id: "back-1",
    name: "Tractions",
    muscleGroup: "back",
    description: "Excellent exercice pour le développement du dos",
    difficulty: "intermediate",
    equipment: "Barre de traction",
    location: ["gym", "outdoor"],
    instructions: [
      "Saisissez la barre avec une prise plus large que les épaules",
      "Tirez votre corps vers le haut jusqu'à ce que votre menton dépasse la barre",
      "Descendez de manière contrôlée",
      "Répétez le mouvement"
    ]
  },
  {
    id: "back-2",
    name: "Rowing barre",
    muscleGroup: "back",
    description: "Exercice complet pour le dos",
    difficulty: "intermediate",
    equipment: "Barre, Poids",
    location: ["gym"],
    instructions: [
      "Penchez-vous en avant avec le dos droit",
      "Saisissez la barre",
      "Tirez la barre vers votre abdomen",
      "Revenez à la position initiale de manière contrôlée"
    ]
  },
  {
    id: "back-3",
    name: "Superman",
    muscleGroup: "back",
    description: "Exercice au sol pour le bas du dos",
    difficulty: "beginner",
    equipment: "Tapis (optionnel)",
    location: ["home", "outdoor", "gym"],
    instructions: [
      "Allongez-vous sur le ventre",
      "Tendez les bras devant vous",
      "Soulevez simultanément les bras et les jambes",
      "Maintenez la position quelques secondes"
    ]
  }
];