
import { SportTrainingRecommendation } from "@/types/workout-session";

/**
 * Base de données scientifique des recommandations d'entraînement par sport et poste
 * Sources:
 * - Journal of Strength and Conditioning Research
 * - International Journal of Sports Physiology and Performance
 * - Journal of Sports Science & Medicine
 * - Sports Medicine
 * - European Journal of Sport Science
 * - Scandinavian Journal of Medicine & Science in Sports
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
    // Talonneur
    "talonneur": {
      primaryExercises: [
        "Squat", "Développé couché", "Soulevé de terre",
        "Rowing barre", "Renforcement cervical"
      ],
      secondaryExercises: [
        "Gainage dynamique", "Tractions", "Exercices d'explosivité",
        "Exercices de lancer"
      ],
      performanceMetrics: {
        raw_strength: 9,
        scrum_technique: 9,
        throwing_accuracy: 10,
        mobility: 8,
        explosiveness: 7
      },
      nutritionGuidelines: {
        proteinIntake: 1.9, // g/kg poids corporel
        carbohydrateIntake: 5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Récupération musculaire", "Coordination fine"]
      }
    },
    // Deuxième ligne
    "deuxième ligne": {
      primaryExercises: [
        "Squat", "Soulevé de terre", "Développé couché", 
        "Tirage vertical", "Fentes lestées"
      ],
      secondaryExercises: [
        "Renforcement lombo-abdominal", "Extension du dos", 
        "Travail des sauts", "Exercices d'agilité"
      ],
      performanceMetrics: {
        raw_strength: 10,
        lineout_jumping: 10,
        work_rate: 8,
        tackling: 8,
        endurance: 7
      },
      nutritionGuidelines: {
        proteinIntake: 2.0, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération musculaire intense", "Récupération articulaire"]
      }
    },
    // Troisième ligne
    "troisième ligne": {
      primaryExercises: [
        "Sprint résisté", "Squat", "Gainage dynamique", 
        "Clean & Jerk", "Burpees"
      ],
      secondaryExercises: [
        "Fentes sautées", "Travail de changements de direction", 
        "Rowing", "Box jumps"
      ],
      performanceMetrics: {
        work_rate: 10,
        tackling: 9,
        speed: 8,
        strength: 8,
        ball_carrying: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.8, // g/kg poids corporel
        carbohydrateIntake: 6, // g/kg poids corporel
        hydrationNeeds: "Très élevés - 3.5-4.5L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération métabolique", "Récupération musculaire"]
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
    // Demi d'ouverture
    "ouvreur": {
      primaryExercises: [
        "Squat sauté", "Exercices de kick", "Sprint fractionnés", 
        "Travail de passes", "Exercices de précision"
      ],
      secondaryExercises: [
        "Renforcement épaules", "Gainage dynamique", 
        "Travail proprioceptif", "Exercices d'équilibre"
      ],
      performanceMetrics: {
        kicking: 10,
        decision_making: 10,
        passing: 9,
        vision: 9,
        tackling: 7
      },
      nutritionGuidelines: {
        proteinIntake: 1.6, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Récupération cognitive", "Précision technique"]
      }
    },
    // Centre
    "centre": {
      primaryExercises: [
        "Sprint résisté", "Squat sauté", "Bench press", 
        "Exercices de plaquage", "Changements de direction"
      ],
      secondaryExercises: [
        "Planche latérale", "Step-ups", "Rotations du tronc", 
        "Exercices de passes"
      ],
      performanceMetrics: {
        tackling: 9,
        line_breaking: 9,
        speed: 8,
        power: 8,
        ball_handling: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.8, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Récupération neuromusculaire", "Récupération des contacts"]
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
    },
    // Arrière
    "arrière": {
      primaryExercises: [
        "Exercices de kick", "Squat sauté", "Sprint", 
        "Travail aérien", "Changements de direction"
      ],
      secondaryExercises: [
        "Stabilisation cheville", "Renforcement lombaire", 
        "Exercices d'équilibre", "Travail sous pression"
      ],
      performanceMetrics: {
        kicking: 9,
        aerial_skills: 10,
        positioning: 9,
        counter_attack: 9,
        tackling: 7
      },
      nutritionGuidelines: {
        proteinIntake: 1.7, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Récupération cognitive", "Vigilance"]
      }
    }
  },
  
  // Volleyball
  "volleyball": {
    // Attaquant
    "attaquant": {
      primaryExercises: [
        "Squat sauté", "Développé couché", "Bulgarian split squat", 
        "Exercices de saut vertical", "Medicine ball throws"
      ],
      secondaryExercises: [
        "Renforcement des épaules", "Stabilisation core", 
        "Travail proprioceptif", "Nordic hamstring"
      ],
      performanceMetrics: {
        vertical_jump: 10,
        arm_swing_power: 9,
        approach_speed: 8,
        hitting_accuracy: 9,
        block_timing: 7
      },
      nutritionGuidelines: {
        proteinIntake: 1.8, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour (sport en intérieur)"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Récupération neuromusculaire", "Puissance explosive"]
      }
    },
    // Passeur
    "passeur": {
      primaryExercises: [
        "Exercices de proprioception des doigts", "Gainage", 
        "Fentes latérales", "Step-ups", "Box jumps"
      ],
      secondaryExercises: [
        "Renforcement poignets", "Rotateurs externes", 
        "Travail d'équilibre", "Exercices de précision"
      ],
      performanceMetrics: {
        setting_accuracy: 10,
        decision_making: 10,
        footwork: 9,
        block_positioning: 8,
        defensive_awareness: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.6, // g/kg poids corporel
        carbohydrateIntake: 5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-3.5L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération cognitive", "Coordination fine"]
      }
    },
    // Libéro
    "libéro": {
      primaryExercises: [
        "Déplacements latéraux", "Exercices de réaction", 
        "Squat", "Gainage", "Fentes dynamiques"
      ],
      secondaryExercises: [
        "Stabilisation épaules", "Renforcement lombaires", 
        "Travail proprioceptif", "Exercices d'agilité"
      ],
      performanceMetrics: {
        reaction_time: 10,
        passing_accuracy: 10,
        agility: 9,
        court_coverage: 9,
        reading_opposing_hitters: 9
      },
      nutritionGuidelines: {
        proteinIntake: 1.7, // g/kg poids corporel
        carbohydrateIntake: 5, // g/kg poids corporel
        hydrationNeeds: "Modérés à élevés - 2.5-3.5L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Vigilance", "Récupération cognitive"]
      }
    },
    // Central (bloqueur)
    "central": {
      primaryExercises: [
        "Squat jump", "Clean & press", "Planche latérale", 
        "Sauts latéraux", "Développé épaules"
      ],
      secondaryExercises: [
        "Renforcement poignets", "Stabilisation tronc", 
        "Travail de coordination", "Box jumps latéraux"
      ],
      performanceMetrics: {
        block_timing: 10,
        lateral_movement: 9,
        vertical_reach: 10,
        reading_setters: 8,
        transition_speed: 7
      },
      nutritionGuidelines: {
        proteinIntake: 1.8, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Récupération musculaire", "Réactivité"]
      }
    }
  },
  
  // Handball
  "handball": {
    // Gardien
    "gardien": {
      primaryExercises: [
        "Squat sauté", "Exercices de réaction", "Split jumps", 
        "Gainage latéral", "Déplacements explosifs"
      ],
      secondaryExercises: [
        "Renforcement épaules", "Stabilisation poignets", 
        "Travail proprioceptif", "Cardio fractionné"
      ],
      performanceMetrics: {
        reaction_time: 10,
        explosive_movement: 9,
        flexibility: 9,
        positional_awareness: 8,
        mental_fortitude: 9
      },
      nutritionGuidelines: {
        proteinIntake: 1.6, // g/kg poids corporel
        carbohydrateIntake: 5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Concentration", "Récupération neuromusculaire"]
      }
    },
    // Arrière
    "arrière": {
      primaryExercises: [
        "Développé couché", "Squat", "Exercices de tir", 
        "Burpees", "Plyométrie"
      ],
      secondaryExercises: [
        "Renforcement triceps", "Stabilisation épaule", 
        "Exercices de feinte", "Sprint résisté"
      ],
      performanceMetrics: {
        throwing_power: 10,
        shooting_accuracy: 9,
        field_vision: 8,
        defensive_skills: 7,
        jump_shot_ability: 9
      },
      nutritionGuidelines: {
        proteinIntake: 1.7, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Récupération musculaire", "Coordination"]
      }
    },
    // Pivot
    "pivot": {
      primaryExercises: [
        "Squat", "Soulevé de terre", "Développé militaire", 
        "Turkish get-up", "Rotation avec médecine-ball"
      ],
      secondaryExercises: [
        "Renforcement lombo-abdominal", "Stabilisation épaules", 
        "Travail d'équilibre", "Exercices de poussée"
      ],
      performanceMetrics: {
        strength: 10,
        contact_balance: 10,
        positioning: 9,
        screening: 9,
        ball_handling: 7
      },
      nutritionGuidelines: {
        proteinIntake: 1.9, // g/kg poids corporel
        carbohydrateIntake: 5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération musculaire intense", "Régénération tissulaire"]
      }
    },
    // Ailier
    "ailier": {
      primaryExercises: [
        "Sprint court", "Squat sauté", "Exercices de tir en suspension", 
        "Déplacements latéraux", "Fentes dynamiques"
      ],
      secondaryExercises: [
        "Renforcement poignets", "Travail proprioceptif", 
        "Exercices de feinte", "Circuit training"
      ],
      performanceMetrics: {
        speed: 10,
        wing_shooting: 10,
        counter_attack: 9,
        agility: 9,
        defensive_footwork: 7
      },
      nutritionGuidelines: {
        proteinIntake: 1.7, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Récupération métabolique", "Réflexes"]
      }
    },
    // Demi-centre
    "demi-centre": {
      primaryExercises: [
        "Exercices de changement de direction", "Squat", "Box jumps", 
        "Gainage dynamique", "Burpees"
      ],
      secondaryExercises: [
        "Renforcement épaules", "Stabilisation core", 
        "Travail proprioceptif", "Passes avec résistance"
      ],
      performanceMetrics: {
        playmaking: 10,
        decision_making: 10,
        ball_handling: 9,
        court_vision: 9,
        defensive_reading: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.7, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération cognitive", "Coordination"]
      }
    }
  },
  
  // Hockey sur glace
  "hockey": {
    // Gardien
    "gardien": {
      primaryExercises: [
        "Déplacements latéraux spécifiques", "Squat", "Gainage profond", 
        "Exercices de réaction", "Étirements dynamiques"
      ],
      secondaryExercises: [
        "Renforcement lombaires", "Stabilisation épaules", 
        "Travail proprioceptif", "Étirements spécifiques"
      ],
      performanceMetrics: {
        reaction_time: 10,
        lateral_movement: 10,
        flexibility: 9,
        positioning: 9,
        recovery_speed: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.7, // g/kg poids corporel
        carbohydrateIntake: 5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération neurologique", "Concentration"]
      }
    },
    // Défenseur
    "défenseur": {
      primaryExercises: [
        "Squat", "Soulevé de terre", "Développé couché", 
        "Exercices de patinage", "Box jumps"
      ],
      secondaryExercises: [
        "Renforcement lombaire", "Core training", 
        "Travail spécifique patinage arrière", "Pliométrie"
      ],
      performanceMetrics: {
        strength: 9,
        backward_skating: 10,
        shot_blocking: 9,
        checking: 9,
        passing: 7
      },
      nutritionGuidelines: {
        proteinIntake: 1.8, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération musculaire", "Réparation tissulaire"]
      }
    },
    // Attaquant
    "attaquant": {
      primaryExercises: [
        "Sprint sur glace", "Squat sauté", "Rotations explosives", 
        "Exercices de tir", "Départs explosifs"
      ],
      secondaryExercises: [
        "Renforcement des poignets", "Exercices d'équilibre", 
        "Travail de maniement", "Cardio fractionné"
      ],
      performanceMetrics: {
        acceleration: 10,
        shooting: 9,
        puck_handling: 9,
        offensive_awareness: 8,
        forechecking: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.8, // g/kg poids corporel
        carbohydrateIntake: 6, // g/kg poids corporel
        hydrationNeeds: "Très élevés - 3.5-4.5L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération métabolique", "Régénération musculaire"]
      }
    },
    // Centre
    "centre": {
      primaryExercises: [
        "Exercices d'engagements", "Squat", "Gainage", 
        "Sprint fractionné", "Rotations du tronc"
      ],
      secondaryExercises: [
        "Core training", "Stabilisation bas du corps", 
        "Travail d'équilibre", "Exercices de vision périphérique"
      ],
      performanceMetrics: {
        faceoff_technique: 10,
        two_way_play: 9,
        hockey_iq: 9,
        supporting_play: 8,
        defensive_awareness: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.8, // g/kg poids corporel
        carbohydrateIntake: 5.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8,
        recoveryFocus: ["Récupération cognitive", "Endurance"]
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
  },
  "natation": {
    "general": {
      primaryExercises: [
        "Pull-ups", "Développé militaire", "Rowing barre", 
        "Gainage", "Squat"
      ],
      secondaryExercises: [
        "Rotations externes", "Y raises", "Face pulls",
        "Core anti-rotation", "Exercices d'épaules"
      ],
      performanceMetrics: {
        shoulder_strength: 10,
        core_stability: 9,
        aerobic_capacity: 10,
        technique_efficiency: 9,
        breathing_control: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.7, // g/kg poids corporel
        carbohydrateIntake: 6.5, // g/kg poids corporel (dépense élevée)
        hydrationNeeds: "Très élevés - 3-4.5L/jour (déshydratation non perçue)"
      },
      sleepRecommendations: {
        minHours: 9,
        recoveryFocus: ["Récupération musculaire complète", "Endurance"]
      }
    },
    "sprint": {
      primaryExercises: [
        "Développé couché", "Rowing avec élastique", "Medicine ball throws", 
        "Planche", "Squat sauté"
      ],
      secondaryExercises: [
        "Rotateurs externes", "Battle ropes", "Tirage vertical",
        "Triceps extensions", "Renforcement mollets"
      ],
      performanceMetrics: {
        power: 10,
        explosive_strength: 9,
        anaerobic_capacity: 10,
        start_technique: 9,
        underwater_phase: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.8, // g/kg poids corporel
        carbohydrateIntake: 6, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération neuromusculaire", "Puissance"]
      }
    },
    "distance": {
      primaryExercises: [
        "Natation fractionnée", "Développé couché", "Rowing", 
        "Gainage latéral", "TRX rows"
      ],
      secondaryExercises: [
        "Renforcement épaules", "Band pull-aparts", "Swiss ball rollouts",
        "Gainage dynamique", "Prone Y raises"
      ],
      performanceMetrics: {
        aerobic_endurance: 10,
        stroke_efficiency: 10,
        muscular_endurance: 9,
        pacing: 8,
        recovery_between_intervals: 9
      },
      nutritionGuidelines: {
        proteinIntake: 1.7, // g/kg poids corporel
        carbohydrateIntake: 7, // g/kg poids corporel (très haute dépense)
        hydrationNeeds: "Critiques - 4-5L/jour"
      },
      sleepRecommendations: {
        minHours: 9,
        recoveryFocus: ["Récupération métabolique", "Endurance musculaire"]
      }
    }
  },
  "cyclisme": {
    "general": {
      primaryExercises: [
        "Squat", "Leg press", "Fentes", 
        "Extensions quadriceps", "Gainage"
      ],
      secondaryExercises: [
        "Hip thrusts", "Renforcement mollets", "Vélo à une jambe",
        "Core anti-flexion", "Stabilisation lombaire"
      ],
      performanceMetrics: {
        aerobic_power: 10,
        lactate_threshold: 9,
        leg_strength: 9,
        core_stability: 8,
        pedaling_technique: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.5, // g/kg poids corporel
        carbohydrateIntake: 7, // g/kg poids corporel (besoins très élevés)
        hydrationNeeds: "Critiques - 500-800ml/heure pendant l'effort"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération métabolique", "Récupération musculaire"]
      }
    },
    "route": {
      primaryExercises: [
        "Squat", "Deadlift", "Step-ups", 
        "Vélo fractionné", "Gainage"
      ],
      secondaryExercises: [
        "Nordic hamstring", "Stabilisation hanche", "Exercices lombaires",
        "Stretching", "Core anti-rotation"
      ],
      performanceMetrics: {
        endurance: 10,
        threshold_power: 9,
        climbing_ability: 8,
        tactical_awareness: 8,
        recovery_capacity: 9
      },
      nutritionGuidelines: {
        proteinIntake: 1.5, // g/kg poids corporel
        carbohydrateIntake: 7.5, // g/kg poids corporel (en périodes d'entraînement intensif)
        hydrationNeeds: "Très élevés - 3.5-5L/jour selon les conditions"
      },
      sleepRecommendations: {
        minHours: 9,
        recoveryFocus: ["Récupération des glycogènes", "Adaptation cardiovasculaire"]
      }
    },
    "piste": {
      primaryExercises: [
        "Squat sauté", "Leg press", "Hack squat", 
        "Sprint sur vélo", "Plyométrie"
      ],
      secondaryExercises: [
        "Extensions de hanche", "Stabilisation core", "Box jumps",
        "Renforcement lombaire", "Exercises ischio-jambiers"
      ],
      performanceMetrics: {
        explosive_power: 10,
        anaerobic_capacity: 10,
        start_technique: 9,
        neuromuscular_efficiency: 9,
        race_tactics: 8
      },
      nutritionGuidelines: {
        proteinIntake: 1.7, // g/kg poids corporel
        carbohydrateIntake: 6.5, // g/kg poids corporel
        hydrationNeeds: "Élevés - 3-4L/jour"
      },
      sleepRecommendations: {
        minHours: 8.5,
        recoveryFocus: ["Récupération neuromusculaire", "Puissance"]
      }
    }
  }
};

