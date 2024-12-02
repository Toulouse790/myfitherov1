import { SportProgram } from "@/types/sports";

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