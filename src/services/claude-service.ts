
import { supabase } from "@/integrations/supabase/client";
import { generateDefaultRecommendation } from "./recommendations-service";

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
  private static async getHistoricalData(userId: string) {
    try {
      const [workouts, nutrition, sleep, previousRecommendations] = await Promise.all([
        supabase.from('workout_sessions').select('*').eq('user_id', userId).limit(5),
        supabase.from('food_journal_entries').select('*').eq('user_id', userId).limit(7),
        supabase.from('sleep_sessions').select('*').eq('user_id', userId).limit(7),
        supabase.from('ai_recommendations').select('*').eq('user_id', userId).limit(5)
      ]);

      return {
        workouts: workouts.data || [],
        nutrition: nutrition.data || [],
        sleep: sleep.data || [],
        previousRecommendations: previousRecommendations.data || []
      };
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return null;
    }
  }

  static async getPersonalizedRecommendations(
    questionnaireData: QuestionnaireData,
    historicalData?: any
  ): Promise<ClaudeResponse> {
    try {
      console.log("Generating recommendations for:", questionnaireData);
      console.log("Historical data:", historicalData);
      
      const recommendations = generateDefaultRecommendation(questionnaireData);
      
      // Calcul du score de confiance
      const confidenceScore = this.calculateConfidenceScore(historicalData, questionnaireData);

      return {
        response: JSON.stringify(recommendations.recommendations),
        metadata: {
          confidence_score: confidenceScore,
          historical_data: historicalData,
          recommendation_type: 'default'
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
      
      // Bonus pour l'historique des recommandations
      if (historicalData.previousRecommendations?.length > 0) {
        const successfulRecommendations = historicalData.previousRecommendations
          .filter((rec: any) => rec.user_feedback?.wasHelpful)
          .length;
        if (successfulRecommendations > 0) {
          score += Math.min(successfulRecommendations * 2, 5);
        }
      }
    }

    // Limite le score à 100
    return Math.min(Math.round(score), 100);
  }
}
