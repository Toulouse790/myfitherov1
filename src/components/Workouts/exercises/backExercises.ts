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
    image: "https://images.unsplash.com/photo-1598971639058-999f3bfbfb09?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop",
    instructions: [
      "Allongez-vous sur le ventre",
      "Tendez les bras devant vous",
      "Soulevez simultanément les bras et les jambes",
      "Maintenez la position quelques secondes"
    ]
  },
  {
    id: "back-4",
    name: "Rowing haltère",
    muscleGroup: "back",
    description: "Excellent exercice pour cibler chaque côté du dos",
    difficulty: "beginner",
    equipment: "Haltères",
    location: ["home", "gym"],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop",
    instructions: [
      "Penchez-vous en avant, un genou sur le banc",
      "Tirez l'haltère vers votre hanche",
      "Serrez l'omoplate à la fin du mouvement",
      "Revenez à la position initiale en contrôle"
    ]
  }
];