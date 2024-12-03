import { Exercise } from '../types/exercise';

export const shouldersExercises: Exercise[] = [
  {
    id: "shoulders-1",
    name: "Développé militaire",
    muscleGroup: "shoulders",
    description: "Exercice fondamental pour développer la force et la masse des épaules",
    difficulty: "intermediate",
    equipment: "Barre ou Haltères",
    location: ["gym"],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop",
    instructions: [
      "Position de départ debout ou assis, dos droit",
      "Barre ou haltères au niveau des épaules",
      "Poussez le poids au-dessus de la tête",
      "Revenez lentement à la position initiale"
    ]
  },
  {
    id: "shoulders-2",
    name: "Élévations latérales",
    muscleGroup: "shoulders",
    description: "Excellent exercice d'isolation pour développer le volume des deltoïdes moyens",
    difficulty: "beginner",
    equipment: "Haltères",
    location: ["home", "gym"],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop",
    instructions: [
      "Debout, haltères le long du corps",
      "Levez les bras sur les côtés jusqu'à l'horizontale",
      "Gardez une légère flexion des coudes",
      "Contrôlez la descente"
    ]
  },
  {
    id: "shoulders-3",
    name: "Élévations frontales",
    muscleGroup: "shoulders",
    description: "Cible les deltoïdes antérieurs pour des épaules bien développées",
    difficulty: "beginner",
    equipment: "Haltères ou Barre",
    location: ["home", "gym"],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop",
    instructions: [
      "Debout, poids devant les cuisses",
      "Levez les poids devant vous jusqu'à l'horizontale",
      "Maintenez brièvement la position haute",
      "Revenez lentement à la position initiale"
    ]
  }
];