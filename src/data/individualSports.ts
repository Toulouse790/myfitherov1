import { SportProgram } from "@/types/sports";
import { Activity, Award } from "lucide-react";

export const tennisPrograms: SportProgram[] = [
  {
    id: "tennis-preseason-intermediate",
    name: "Programme de reprise Tennis",
    sport: "tennis",
    type: "individual",
    level: "intermediate",
    phase: "preseason",
    description: "Programme de préparation physique pour la reprise de saison de tennis",
    duration: 4,
    sessionsPerWeek: 3,
    icon: Activity,
    exercises: [
      {
        name: "Déplacements latéraux",
        sets: 3,
        reps: 10,
        rest: 60,
        notes: "5 déplacements de chaque côté"
      },
      {
        name: "Rotations du tronc avec élastique",
        sets: 3,
        reps: 15,
        rest: 45
      },
      {
        name: "Fentes avec rotation",
        sets: 3,
        reps: 12,
        rest: 60
      },
      {
        name: "Gainage dynamique",
        sets: 3,
        reps: 1,
        rest: 45,
        notes: "30 secondes par position"
      }
    ],
    goals: [
      "Améliorer la mobilité des hanches et des épaules",
      "Développer la stabilité du core",
      "Augmenter la vitesse de déplacement latéral"
    ],
    requirements: [
      "Élastique de résistance",
      "Espace pour les déplacements",
      "Tapis de sol"
    ]
  }
];

export const runningPrograms: SportProgram[] = [
  {
    id: "running-preseason-intermediate",
    name: "Programme de reprise Course à pied",
    sport: "running",
    type: "individual",
    level: "intermediate",
    phase: "preseason",
    description: "Programme de préparation pour la reprise de la course à pied",
    duration: 8,
    sessionsPerWeek: 3,
    icon: Award,
    exercises: [
      {
        name: "Course d'endurance",
        sets: 1,
        reps: 1,
        rest: 0,
        notes: "30 minutes à rythme modéré"
      },
      {
        name: "Montées de genoux",
        sets: 3,
        reps: 20,
        rest: 60
      },
      {
        name: "Talons-fesses",
        sets: 3,
        reps: 20,
        rest: 60
      },
      {
        name: "Renforcement mollets",
        sets: 3,
        reps: 15,
        rest: 45
      }
    ],
    goals: [
      "Développer l'endurance de base",
      "Améliorer la technique de course",
      "Renforcer les muscles spécifiques à la course"
    ],
    requirements: [
      "Chaussures de course adaptées",
      "Parcours varié (plat et côtes)",
      "Montre ou application de suivi"
    ]
  }
];
