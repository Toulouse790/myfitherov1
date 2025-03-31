
import { SportTrainingRecommendation } from "@/types/workout-session";

/**
 * Base de données scientifique des recommandations d'entraînement par sport et poste
 * Sources:
 * - Journal of Strength and Conditioning Research
 * - International Journal of Sports Physiology and Performance
 * - Journal of Sports Science & Medicine
 * - Sports Medicine
 */

export const sportScienceRecommendations: Record<string, Record<string, SportTrainingRecommendation>> = {
  // Football
  "football": {
    // Gardien de but
    "gardien": {
      primaryExercises: [
        "Squat jump", "Développé couché", "Gainage latéral", 
        "Fentes latérales", "Pompes pliométriques"
      ],
      secondaryExercises: [
        "Extension des poignets", "Renforcement des avant-bras",
        "Rotation externe de l'épaule"
      ],
      performanceMetrics: {
        explosive_power: 9,
        reaction_time: 10,
        lateral_mobility: 9,
        core_stability: 8,
        hand_eye_coordination: 10
      },
      nutritionGuidelines: {
        proteinIntake: 1.6, // g/kg poids corporel
        carbohydrateIntake: 5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Récupération neurologique", "Coordination"] 
      }
    },
    // Défenseur central
    "defenseur": {
      primaryExercises: [
        "Squat", "Soulevé de terre", "Développé militaire",
        "Tractions", "Sprint avec résistance"
      ],
      secondaryExercises: [
        "Extensions lombaires", "Gainage", "Step-ups",
        "Rotations du tronc"
      ],
      performanceMetrics: {
        strength: 9,
        power: 7,
        jumping_ability: 8,
        tackling_precision: 9,
        positional_awareness: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.8, // g/kg poids corporel
        carbohydrateIntake: 5, // g/kg poids corporel
        hydrationNeeds: "Modérés à élevés - 2.5-3.5L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Récupération musculaire", "Consolidation de la mémoire tactique"]
      }
    },
    // Milieu de terrain
    "milieu": {
      primaryExercises: [
        "Course fractionnée", "Circuit training", "Bulgarian split squat",
        "Burpees", "Mountain climbers" 
      ],
      secondaryExercises: [
        "Gainage dynamique", "Pompes", "Squat à une jambe",
        "Extension des hanches"
      ],
      performanceMetrics: {
        aerobic_endurance: 10,
        repeated_sprint_ability: 9,
        agility: 8,
        passing_accuracy: 9,
        vision: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.6, // g/kg poids corporel
        carbohydrateIntake: 6, // g/kg poids corporel (besoins plus élevés en endurance)
        hydrationNeeds: "Très élevés - 3-4.5L/jour pendant l'entraînement"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération glycogénique", "Récupération cardiovasculaire"]
      }
    },
    // Attaquant
    "attaquant": {
      primaryExercises: [
        "Squat sauté", "Box jumps", "Sprint court", 
        "Développé couché incliné", "Rotations explosives"
      ],
      secondaryExercises: [
        "Fentes sautées", "Renforcement ischio-jambiers",
        "Équilibre unipodal", "Step-ups latéraux"
      ],
      performanceMetrics: {
        acceleration: 10,
        explosive_power: 9,
        change_of_direction: 8,
        finishing: 9,
        creativity: 7
      },
      nutritionGuidelines: {
        proteinIntake: 1.7, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Récupération neuromusculaire", "Réflexes"]
      }
    }
  },
  
  // Basketball
  "basketball": {
    // Meneur
    "meneur": {
      primaryExercises: [
        "Burpees", "Mountain climbers", "Exercices de changement de direction",
        "Step-ups latéraux", "Pompes avec rotation"
      ],
      secondaryExercises: [
        "Renforcement des épaules", "Gainage", "Squat sauté",
        "Équilibre dynamique"
      ],
      performanceMetrics: {
        agility: 10,
        ball_handling: 10,
        decision_making: 9,
        change_of_pace: 9,
        endurance: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.6, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Très élevés - 3-4L/jour (sport en intérieur)"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Réactivité cognitive", "Coordination fine"]
      }
    },
    // Ailier
    "ailier": {
      primaryExercises: [
        "Squat sauté", "Développé couché", "Tractions",
        "Box jumps", "Rotations du tronc avec médecine-ball"
      ],
      secondaryExercises: [
        "Pompes pliométriques", "Renforcement lombaire",
        "Exercices de stabilisation unipodal", "Fentes dynamiques"
      ],
      performanceMetrics: {
        vertical_jump: 9,
        shooting: 9,
        defensive_sliding: 8,
        wingspan_utilization: 8,
        versatility: 9
      },
      nutritionGuidelines: {
        proteinIntake: 1.7, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Récupération neuromusculaire", "Régénération articulaire"]
      }
    },
    // Pivot
    "pivot": {
      primaryExercises: [
        "Squat", "Soulevé de terre", "Développé militaire",
        "Développé couché", "Turkish get-up"
      ],
      secondaryExercises: [
        "Extensions lombaires", "Superman", "Soulevé de terre roumain",
        "Rotations avec résistance"
      ],
      performanceMetrics: {
        strength: 10,
        rebounding: 10,
        post_play: 9,
        screening: 8,
        intimidation: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.8, // g/kg poids corporel
        carbohydrateIntake: 5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération musculaire intense", "Santé articulaire"]
      }
    }
  },
  
  // Rugby
  "rugby": {
    // Pilier
    "pilier": {
      primaryExercises: [
        "Squat", "Soulevé de terre", "Développé couché",
        "Rowing barre", "Tirage vertical"
      ],
      secondaryExercises: [
        "Renforcement cervical spécifique", "Gainage profond",
        "Good morning", "Extensions lombaires"
      ],
      performanceMetrics: {
        raw_strength: 10,
        scrum_technique: 10,
        neck_strength: 9,
        stability: 8,
        endurance: 7
      },
      nutritionGuidelines: {
        proteinIntake: 2.0, // g/kg poids corporel
        carbohydrateIntake: 5, // g/kg poids corporel
        hydrationNeeds: "Modérés à élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération des tissus conjonctifs", "Récupération musculaire intense"]
      }
    },
    // Demi de mêlée
    "demi": {
      primaryExercises: [
        "Course fractionnée", "Exercices de changement de direction",
        "Squat sauté", "Fentes multidirectionnelles", "Gainage dynamique"
      ],
      secondaryExercises: [
        "Renforcement des avant-bras", "Stabilisation des épaules",
        "Travail proprioceptif", "Équilibre dynamique"
      ],
      performanceMetrics: {
        passing_accuracy: 10,
        decision_making: 9,
        agility: 9,
        core_strength: 8,
        vision: 9
      },
      nutritionGuidelines: {
        proteinIntake: 1.7, // g/kg poids corporel
        carbohydrateIntake: 6, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération cognitive", "Coordination neuromusculaire"]
      }
    },
    // Ailier
    "ailier_rugby": {
      primaryExercises: [
        "Sprint résisté", "Sprint en côte", "Step-ups explosifs",
        "Squat sauté", "Bulgarian split squat"
      ],
      secondaryExercises: [
        "Renforcement ischio-jambiers", "Rotateurs externes",
        "Stabilisation unipodale", "Renforcement core dynamique"
      ],
      performanceMetrics: {
        speed: 10,
        acceleration: 10,
        evasive_skills: 9,
        finishing: 9,
        aerial_skills: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.8, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Très élevés - 3.5-4.5L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération musculaire", "Régénération nerveuse"]
      }
    }
  },
  
  // Sports individuels
  "tennis": {
    "general": {
      primaryExercises: [
        "Fentes multidirectionnelles", "Exercices de rotations",
        "Déplacements latéraux", "Squat à une jambe", "Stabilisation des épaules"
      ],
      secondaryExercises: [
        "Renforcement des avant-bras", "Extension des poignets",
        "Renforcement rotateurs", "Core anti-rotation"
      ],
      performanceMetrics: {
        agility: 9,
        power: 8,
        endurance: 8,
        rotational_strength: 9,
        shoulder_stability: 9
      },
      nutritionGuidelines: {
        proteinIntake: 1.6, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Très élevés - 3-4.5L/jour (surtout en compétition)"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération nerveuse", "Coordination fine"]
      }
    }
  },
  "running": {
    "general": {
      primaryExercises: [
        "Course fractionnée", "Fartlek", "Montées", 
        "Squat", "Soulevé de terre roumain"
      ],
      secondaryExercises: [
        "Renforcement des mollets", "Exercices de stabilisation de la hanche",
        "Gainage", "Exercices proprioceptifs"
      ],
      performanceMetrics: {
        aerobic_capacity: 10,
        lactate_threshold: 9,
        running_economy: 9,
        core_stability: 8,
        joint_health: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.6, // g/kg poids corporel
        carbohydrateIntake: 7, // g/kg poids corporel (besoins élevés)
        hydrationNeeds: "Critiques - 3-5L/jour selon conditions"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération métabolique", "Régénération musculaire"]
      }
    }
  }
};
