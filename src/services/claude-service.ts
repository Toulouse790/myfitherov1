
import { supabase } from "@/integrations/supabase/client";

export interface ClaudeResponse {
  response: string;
  metadata?: any;
}

interface QuestionnaireData {
  gender?: string;
  age?: string;
  weight?: string;
  height?: string;
  objective?: string;
  training_frequency?: string;
  experience_level?: string;
  available_equipment?: string[];
  workout_duration?: string;
  diet_type?: string;
}

export class ClaudeService {
  private static generatePromptContext(historicalData: any): string {
    if (!historicalData) return '';

    const workoutCount = historicalData.workouts?.length || 0;
    const hasNutritionTracking = historicalData.nutrition?.length > 0;
    const hasSleepTracking = historicalData.sleep?.length > 0;

    let context = '\nContexte utilisateur :\n';
    
    if (workoutCount > 0) {
      context += `- ${workoutCount} entraînements récents enregistrés\n`;
    }

    if (hasNutritionTracking) {
      context += '- Suivi nutritionnel actif\n';
    }

    if (hasSleepTracking) {
      context += '- Suivi du sommeil actif\n';
    }

    if (historicalData.previousRecommendations?.length > 0) {
      const lastRecommendation = historicalData.previousRecommendations[0];
      context += `- Dernière recommandation (${new Date(lastRecommendation.created_at).toLocaleDateString()}): ${lastRecommendation.recommendation_type}\n`;
    }

    return context;
  }

  private static generateQuestionnairePrompt(data: QuestionnaireData, historicalData?: any): string {
    const contextInfo = this.generatePromptContext(historicalData);

    return `En tant qu'expert en fitness et nutrition, analyse les informations suivantes et fournit des recommandations personnalisées détaillées :
    
Profil :
- Genre : ${data.gender}
- Âge : ${data.age} ans
- Poids : ${data.weight} kg
- Taille : ${data.height} cm
- Objectif principal : ${data.objective}
- Fréquence d'entraînement : ${data.training_frequency} sessions/semaine
- Niveau d'expérience : ${data.experience_level}
- Durée d'entraînement : ${data.workout_duration} minutes
- Équipement disponible : ${data.available_equipment?.join(', ')}
- Type de régime : ${data.diet_type}

${contextInfo}

Fournis des recommandations détaillées et structurées pour :
1. Plan d'entraînement adapté
2. Conseils nutritionnels personnalisés
3. Objectifs réalistes à court et moyen terme
4. Points d'attention particuliers

Les recommandations doivent être :
- Spécifiques et actionnables
- Adaptées au niveau et à l'équipement
- Progressives et mesurables
- Sûres et durables
- Basées sur les données historiques si disponibles`;
  }

  static async getPersonalizedRecommendations(
    questionnaireData: QuestionnaireData,
    historicalData?: any
  ): Promise<ClaudeResponse> {
    try {
      console.log("Generating recommendations for:", questionnaireData);
      console.log("Historical data:", historicalData);
      
      const prompt = this.generateQuestionnairePrompt(questionnaireData, historicalData);
      
      const { data, error } = await supabase.functions.invoke('chat-with-anthropic', {
        body: { content: prompt }
      });

      if (error) {
        console.error('Error getting recommendations:', error);
        throw error;
      }

      // Calcul du score de confiance
      const confidenceScore = this.calculateConfidenceScore(historicalData, questionnaireData);

      return {
        response: data.response,
        metadata: {
          confidence_score: confidenceScore,
          historical_data: historicalData,
          ...data.metadata
        }
      };
    } catch (error) {
      console.error('Error in Claude service:', error);
      throw error;
    }
  }

  private static calculateConfidenceScore(historicalData: any, questionnaireData: QuestionnaireData): number {
    let score = 70; // Score de base

    // Ajustement basé sur la complétude du questionnaire
    const requiredFields = [
      'gender', 'age', 'weight', 'height', 'objective',
      'training_frequency', 'experience_level', 'workout_duration'
    ];
    const completionRate = requiredFields.filter(field => 
      questionnaireData[field as keyof QuestionnaireData]
    ).length / requiredFields.length;
    score += completionRate * 10;

    // Ajustement basé sur les données historiques
    if (historicalData) {
      if (historicalData.workouts?.length > 0) score += 5;
      if (historicalData.nutrition?.length > 0) score += 5;
      if (historicalData.sleep?.length > 0) score += 5;
    }

    // Limite le score à 100
    return Math.min(Math.round(score), 100);
  }
}
