import { Exercise } from '../../types/exercise';

export const advancedChestExercises: Exercise[] = [
  {
    id: "chest_3",
    name: "Développé décliné",
    muscle_group: "chest",
    muscleGroup: "chest",
    description: "Cible la partie inférieure des pectoraux",
    difficulty: ["intermediate"],
    equipment: "Banc décliné, Barre, Poids",
    location: ["gym"],
    image_url: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Installez-vous sur un banc décliné",
      "Saisissez la barre avec une prise légèrement plus large que les épaules",
      "Descendez la barre vers le bas de la poitrine",
      "Poussez la barre vers le haut"
    ],
    targetMuscles: ["pectoraux inférieurs", "deltoïdes antérieurs", "triceps"],
    objectives: ["muscle_gain", "maintenance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
    },
    reps: {
      beginner: 8,
      intermediate: 10,
      advanced: 12
    },
    restTime: {
      beginner: 120,
      intermediate: 90,
      advanced: 60
    },
    calories: 140
  },
  {
    id: "chest_4",
    name: "Écarté avec haltères",
    muscle_group: "chest",
    muscleGroup: "chest",
    description: "Excellent exercice d'isolation pour les pectoraux",
    difficulty: ["intermediate"],
    equipment: "Banc, Haltères",
    location: ["gym"],
    image_url: "/lovable-uploads/43b8ea2e-ad76-45ae-8160-9a685ec8385d.png",
    instructions: [
      "Allongez-vous sur un banc plat",
      "Tenez les haltères au-dessus de la poitrine",
      "Écartez les bras en gardant un léger pli aux coudes",
      "Ramenez les haltères en position initiale"
    ],
    targetMuscles: ["pectoraux", "deltoïdes antérieurs"],
    objectives: ["muscle_gain", "maintenance"],
    sets: {
      beginner: 3,
      intermediate: 4,
      advanced: 4
    },
    reps: {
      beginner: 10,
      intermediate: 12,
      advanced: 15
    },
    restTime: {
      beginner: 90,
      intermediate: 60,
      advanced: 45
    },
    calories: 100
  }
];