import { Exercise } from '../types/exercise';

export const shouldersExercises: Exercise[] = [
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
  }
];