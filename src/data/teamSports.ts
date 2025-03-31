
import { SportProgram } from "@/types/sports";
import { Activity, Award, Dumbbell } from "lucide-react";

export const footballPrograms: SportProgram[] = [
  {
    id: "football-preseason-intermediate",
    name: "Programme de reprise Football",
    sport: "football",
    type: "team",
    level: "intermediate",
    phase: "preseason",
    description: "Programme de préparation physique pour la reprise de saison de football",
    duration: 6,
    sessionsPerWeek: 3,
    icon: Activity,
    exercises: [
      {
        name: "Course fractionnée",
        sets: 4,
        reps: 1,
        rest: 60,
        notes: "30s sprint / 30s marche"
      },
      {
        name: "Squats",
        sets: 3,
        reps: 15,
        rest: 90
      },
      {
        name: "Fentes alternées",
        sets: 3,
        reps: 12,
        rest: 60
      },
      {
        name: "Gainage",
        sets: 3,
        reps: 1,
        rest: 45,
        notes: "Maintenir 45 secondes"
      }
    ],
    goals: [
      "Améliorer l'endurance cardiovasculaire",
      "Renforcer les jambes",
      "Développer la stabilité du core"
    ],
    requirements: [
      "Chaussures de course",
      "Espace extérieur ou salle de sport"
    ]
  }
];

export const basketballPrograms: SportProgram[] = [
  {
    id: "basketball-preseason-intermediate",
    name: "Programme de reprise Basketball",
    sport: "basketball",
    type: "team",
    level: "intermediate",
    phase: "preseason",
    description: "Programme de préparation physique pour la reprise de saison de basketball",
    duration: 6,
    sessionsPerWeek: 4,
    icon: Dumbbell,
    exercises: [
      {
        name: "Sauts avec genoux hauts",
        sets: 3,
        reps: 20,
        rest: 60
      },
      {
        name: "Pompes explosives",
        sets: 3,
        reps: 12,
        rest: 90
      },
      {
        name: "Squats sautés",
        sets: 4,
        reps: 10,
        rest: 90
      },
      {
        name: "Gainage latéral",
        sets: 2,
        reps: 1,
        rest: 45,
        notes: "30 secondes de chaque côté"
      }
    ],
    goals: [
      "Développer la puissance explosive",
      "Améliorer la détente verticale",
      "Renforcer le haut du corps"
    ],
    requirements: [
      "Espace pour les exercices pliométriques",
      "Tapis de sol"
    ]
  }
];

export const volleyballPrograms: SportProgram[] = [
  {
    id: "volleyball-preseason-intermediate",
    name: "Programme de reprise Volleyball",
    sport: "volleyball",
    type: "team",
    level: "intermediate",
    phase: "preseason",
    description: "Programme de préparation physique pour la reprise de saison de volleyball",
    duration: 6,
    sessionsPerWeek: 3,
    icon: Activity,
    exercises: [
      {
        name: "Squat sauté",
        sets: 4,
        reps: 10,
        rest: 60
      },
      {
        name: "Box jumps",
        sets: 3,
        reps: 12,
        rest: 90
      },
      {
        name: "Développé couché",
        sets: 3,
        reps: 12,
        rest: 60
      },
      {
        name: "Medicine ball throws",
        sets: 3,
        reps: 15,
        rest: 45,
        notes: "Lancers avec rotation"
      }
    ],
    goals: [
      "Améliorer la détente verticale",
      "Développer la puissance des épaules",
      "Renforcer les rotations du tronc"
    ],
    requirements: [
      "Boîte de pliométrie",
      "Medicine ball",
      "Banc de développé couché"
    ]
  }
];

export const handballPrograms: SportProgram[] = [
  {
    id: "handball-preseason-intermediate",
    name: "Programme de reprise Handball",
    sport: "handball",
    type: "team",
    level: "intermediate",
    phase: "preseason",
    description: "Programme de préparation physique pour la reprise de saison de handball",
    duration: 6,
    sessionsPerWeek: 4,
    icon: Activity,
    exercises: [
      {
        name: "Exercices de tir",
        sets: 3,
        reps: 15,
        rest: 60,
        notes: "Avec medecine ball"
      },
      {
        name: "Fentes sautées",
        sets: 3,
        reps: 10,
        rest: 60
      },
      {
        name: "Déplacements latéraux",
        sets: 4,
        reps: 1,
        rest: 45,
        notes: "30 secondes par série"
      },
      {
        name: "Renforcement des épaules",
        sets: 3,
        reps: 12,
        rest: 60
      }
    ],
    goals: [
      "Améliorer la puissance de tir",
      "Développer l'explosivité",
      "Renforcer les épaules"
    ],
    requirements: [
      "Medicine ball",
      "Élastiques de résistance",
      "Espace pour déplacements"
    ]
  }
];

export const hockeyPrograms: SportProgram[] = [
  {
    id: "hockey-preseason-intermediate",
    name: "Programme de reprise Hockey sur glace",
    sport: "hockey",
    type: "team",
    level: "intermediate",
    phase: "preseason",
    description: "Programme de préparation physique pour la reprise de saison de hockey sur glace",
    duration: 6,
    sessionsPerWeek: 4,
    icon: Dumbbell,
    exercises: [
      {
        name: "Squat",
        sets: 4,
        reps: 12,
        rest: 90
      },
      {
        name: "Départs explosifs",
        sets: 4,
        reps: 6,
        rest: 60,
        notes: "Simulation départs sur glace"
      },
      {
        name: "Core training",
        sets: 3,
        reps: 1,
        rest: 45,
        notes: "Circuit de 3 exercices"
      },
      {
        name: "Exercices d'équilibre",
        sets: 3,
        reps: 1,
        rest: 30,
        notes: "30 secondes par position"
      }
    ],
    goals: [
      "Renforcer le bas du corps",
      "Améliorer l'explosivité",
      "Développer la stabilité et l'équilibre"
    ],
    requirements: [
      "Poids libres",
      "Surface instable (bosu)",
      "Espace pour déplacements"
    ]
  }
];
