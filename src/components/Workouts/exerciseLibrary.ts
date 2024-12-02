export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description: string;
  difficulty: string;
  equipment: string;
  location: string[];
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
  },
  
  // Dos
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
  },

  // Jambes
  {
    id: "legs-1",
    name: "Squats",
    muscleGroup: "legs",
    description: "L'exercice roi pour les jambes",
    difficulty: "beginner",
    equipment: "Optionnel: Barre, Poids",
    location: ["home", "outdoor", "gym"],
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
    location: ["home", "outdoor", "gym"],
    instructions: [
      "Faites un grand pas en avant",
      "Descendez jusqu'à ce que les deux genoux soient à 90 degrés",
      "Gardez le torse droit",
      "Poussez sur le pied avant pour revenir à la position initiale"
    ]
  },
  {
    id: "legs-3",
    name: "Presse à cuisses",
    muscleGroup: "legs",
    description: "Exercice de musculation pour les jambes sur machine",
    difficulty: "intermediate",
    equipment: "Machine presse à cuisses",
    location: ["gym"],
    instructions: [
      "Réglez le siège à la bonne hauteur",
      "Placez vos pieds largeur d'épaules",
      "Poussez la plateforme",
      "Contrôlez la descente"
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
    location: ["gym"],
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
    location: ["home", "gym"],
    instructions: [
      "Tenez-vous debout avec un haltère dans chaque main",
      "Levez les bras sur les côtés jusqu'à l'horizontale",
      "Maintenez brièvement la position",
      "Redescendez lentement"
    ]
  },
  {
    id: "shoulders-3",
    name: "Handstand push-ups",
    muscleGroup: "shoulders",
    description: "Exercice avancé de poids de corps",
    difficulty: "expert",
    equipment: "Mur",
    location: ["home", "outdoor", "gym"],
    instructions: [
      "Placez-vous en équilibre sur les mains contre un mur",
      "Fléchissez les bras pour descendre",
      "Poussez pour remonter",
      "Maintenez l'alignement du corps"
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
  },

  // Abdominaux
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