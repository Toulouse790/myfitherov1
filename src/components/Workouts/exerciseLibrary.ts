export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description: string;
  difficulty: string;
  equipment: string;
  image?: string;
  instructions: string[];
}

export const exercises: Exercise[] = [
  // Pectoraux
  {
    id: "chest-1",
    name: "Développé couché",
    muscleGroup: "chest",
    description: "Un exercice fondamental pour le développement des pectoraux",
    difficulty: "intermediate",
    equipment: "Banc, Barre, Poids",
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
    instructions: [
      "Placez vos mains légèrement plus larges que vos épaules",
      "Gardez votre corps droit",
      "Descendez votre poitrine près du sol",
      "Poussez pour revenir à la position initiale"
    ]
  },
  
  // Dos
  {
    id: "back-1",
    name: "Tractions",
    muscleGroup: "back",
    description: "Excellent exercice pour le développement du dos",
    difficulty: "intermediate",
    equipment: "Barre de traction",
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
    instructions: [
      "Penchez-vous en avant avec le dos droit",
      "Saisissez la barre",
      "Tirez la barre vers votre abdomen",
      "Revenez à la position initiale de manière contrôlée"
    ]
  },

  // Jambes
  {
    id: "legs-1",
    name: "Squats",
    muscleGroup: "legs",
    description: "L'exercice roi pour les jambes",
    difficulty: "beginner",
    equipment: "Optionnel: Barre, Poids",
    instructions: [
      "Tenez-vous debout, pieds écartés largeur d'épaules",
      "Descendez comme pour vous asseoir",
      "Gardez le dos droit et les genoux alignés avec les orteils",
      "Remontez en poussant sur vos talons"
    ]
  },
  {
    id: "legs-2",
    name: "Fentes avant",
    muscleGroup: "legs",
    description: "Excellent exercice pour cibler chaque jambe individuellement",
    difficulty: "beginner",
    equipment: "Optionnel: Haltères",
    instructions: [
      "Faites un grand pas en avant",
      "Descendez jusqu'à ce que les deux genoux soient à 90 degrés",
      "Gardez le torse droit",
      "Poussez sur le pied avant pour revenir à la position initiale"
    ]
  },

  // Épaules
  {
    id: "shoulders-1",
    name: "Développé militaire",
    muscleGroup: "shoulders",
    description: "Exercice fondamental pour les épaules",
    difficulty: "intermediate",
    equipment: "Barre ou Haltères",
    instructions: [
      "Tenez-vous debout ou assis avec le dos droit",
      "Poussez le poids au-dessus de votre tête",
      "Descendez le poids au niveau des épaules",
      "Répétez le mouvement"
    ]
  },
  {
    id: "shoulders-2",
    name: "Élévations latérales",
    muscleGroup: "shoulders",
    description: "Isolation des deltoïdes moyens",
    difficulty: "beginner",
    equipment: "Haltères",
    instructions: [
      "Tenez-vous debout avec un haltère dans chaque main",
      "Levez les bras sur les côtés jusqu'à l'horizontale",
      "Maintenez brièvement la position",
      "Redescendez lentement"
    ]
  },

  // Bras
  {
    id: "arms-1",
    name: "Curl biceps",
    muscleGroup: "arms",
    description: "L'exercice classique pour les biceps",
    difficulty: "beginner",
    equipment: "Haltères ou Barre",
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
    instructions: [
      "Tenez le poids au-dessus de votre tête",
      "Descendez le poids derrière votre tête",
      "Étendez les bras vers le haut",
      "Répétez le mouvement"
    ]
  },

  // Abdominaux
  {
    id: "abs-1",
    name: "Crunchs",
    muscleGroup: "abs",
    description: "Exercice de base pour les abdominaux",
    difficulty: "beginner",
    equipment: "Tapis",
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
    instructions: [
      "Placez-vous en position de pompe sur les avant-bras",
      "Gardez le corps parfaitement aligné",
      "Contractez les abdominaux",
      "Maintenez la position"
    ]
  }
];