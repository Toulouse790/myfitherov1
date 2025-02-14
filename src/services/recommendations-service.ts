
interface UserData {
  objective?: string;
  experience_level?: string;
  training_frequency?: number;
  available_equipment?: string[];
  workout_duration?: number;
  diet_type?: string;
}

interface Recommendation {
  type: 'default' | 'ai';
  message: string;
  confidence_score: number;
  recommendations: {
    workout: string[];
    nutrition: string[];
    recovery: string[];
  }
}

export const generateDefaultRecommendation = (userData: UserData): Recommendation => {
  // Calcul d'un score de confiance basique
  const confidenceScore = 70; // Score de base pour les recommandations par défaut

  // Recommandations d'entraînement basées sur le niveau et la fréquence
  const workoutRecs = [];
  if (userData.experience_level === 'beginner') {
    workoutRecs.push(
      "Commencez par 3 séances par semaine",
      "Focalisez-vous sur la technique",
      "Privilégiez les exercices composés"
    );
  } else {
    workoutRecs.push(
      "Maintenez 4-5 séances par semaine",
      "Variez l'intensité des séances",
      "Incluez des exercices de spécialisation"
    );
  }

  // Recommandations nutritionnelles basées sur l'objectif
  const nutritionRecs = [];
  if (userData.objective === 'muscle_gain') {
    nutritionRecs.push(
      "Augmentez progressivement les calories",
      "Privilégiez les protéines (2g/kg)",
      "Répartissez les repas sur la journée"
    );
  } else if (userData.objective === 'fat_loss') {
    nutritionRecs.push(
      "Créez un déficit calorique modéré",
      "Maintenez un apport protéique élevé",
      "Privilégiez les aliments rassasiants"
    );
  } else {
    nutritionRecs.push(
      "Maintenez une alimentation équilibrée",
      "Adaptez les portions à votre activité",
      "Variez les sources de nutriments"
    );
  }

  // Recommandations de récupération
  const recoveryRecs = [
    "Dormez 7-9h par nuit",
    "Hydratez-vous régulièrement",
    "Écoutez votre corps pour les jours de repos"
  ];

  return {
    type: 'default',
    message: "Recommandations personnalisées basées sur votre profil",
    confidence_score: confidenceScore,
    recommendations: {
      workout: workoutRecs,
      nutrition: nutritionRecs,
      recovery: recoveryRecs
    }
  };
};
