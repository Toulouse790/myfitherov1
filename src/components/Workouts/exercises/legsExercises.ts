import { Exercise } from '../types/exercise';

export const legsExercises: Exercise[] = [
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
  }
];