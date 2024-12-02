import { Exercise } from '../types/exercise';

export const armsExercises: Exercise[] = [
  {
    id: "arms-1",
    name: "Curl biceps",
    muscleGroup: "arms",
    description: "L'exercice classique pour les biceps",
    difficulty: "beginner",
    equipment: "Haltères ou Barre",
    location: ["home", "gym"],
    instructions: [
      "Tenez les poids bras tendus",
      "Fléchissez les coudes pour monter les poids",
      "Maintenez la position haute brièvement",
      "Redescendez lentement"
    ]
  },
  {
    id: "arms-2",
    name: "Extensions triceps",
    muscleGroup: "arms",
    description: "Excellent exercice pour cibler les triceps",
    difficulty: "beginner",
    equipment: "Haltère ou Corde",
    location: ["gym"],
    instructions: [
      "Tenez le poids au-dessus de votre tête",
      "Descendez le poids derrière votre tête",
      "Étendez les bras vers le haut",
      "Répétez le mouvement"
    ]
  },
  {
    id: "arms-3",
    name: "Dips",
    muscleGroup: "arms",
    description: "Exercice composé pour triceps et pectoraux",
    difficulty: "intermediate",
    equipment: "Barres parallèles ou chaise",
    location: ["home", "outdoor", "gym"],
    instructions: [
      "Placez-vous entre les barres",
      "Descendez en fléchissant les coudes",
      "Poussez pour remonter",
      "Gardez le corps droit ou légèrement penché"
    ]
  }
];