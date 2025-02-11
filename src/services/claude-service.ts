
import { supabase } from "@/integrations/supabase/client";
import { calculateConfidenceScore } from "@/utils/ai-utils";

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

    return `
Contexte utilisateur :
- Derniers entraînements : ${historicalData.recentWorkouts || 'Aucun'}
- Habitudes alimentaires : ${historicalData.nutritionHabits || 'Non renseignées'}
- Qualité du sommeil : ${historicalData.sleepQuality || 'Non renseignée'}
- Progression : ${historicalData.progression || 'Non disponible'}
`;
  }

  private static generateQuestionnairePrompt(data: QuestionnaireData, historicalData?: any): string {
    const contextInfo = this.generatePromptContext(historicalData);

    return `En tant qu'expert en fitness et nutrition, analyse les informations suivantes et fournit des recommandations personnalisées :
    
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

Fournis des recommandations détaillées pour :
1. Plan d'entraînement adapté
2. Conseils nutritionnels personnalisés
3. Objectifs réalistes à court et moyen terme
4. Points d'attention particuliers

Les recommandations doivent être :
- Spécifiques et actionnables
- Adaptées au niveau et à l'équipement
- Progressives et mesurables
- Sûres et durables`;
  }

  private static async getUserHistoricalData(userId: string) {
    try {
      const { data: workouts } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: nutrition } = await supabase
        .from('food_journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(7);

      const { data: sleep } = await supabase
        .from('sleep_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(7);

      return {
        recentWorkouts: workouts?.length || 0,
        nutritionHabits: nutrition?.length ? 'Suivi régulier' : 'Pas de suivi',
        sleepQuality: sleep?.length ? 'Suivi régulier' : 'Pas de suivi',
        progression: workouts?.length ? 'En progression' : 'Début du suivi'
      };
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return null;
    }
  }

  static async getPersonalizedRecommendations(questionnaireData: QuestionnaireData): Promise<ClaudeResponse> {
    try {
      console.log("Generating recommendations for:", questionnaireData);
      
      const { data: { user } } = await supabase.auth.getUser();
      const historicalData = user ? await this.getUserHistoricalData(user.id) : null;
      
      const prompt = this.generateQuestionnairePrompt(questionnaireData, historicalData);
      
      const { data, error } = await supabase.functions.invoke('chat-with-anthropic', {
        body: { content: prompt }
      });

      if (error) {
        console.error('Error getting recommendations:', error);
        throw error;
      }

      const confidenceScore = calculateConfidenceScore(historicalData);

      // Sauvegarder la recommandation
      if (user) {
        const { error: saveError } = await supabase
          .from('ai_recommendations')
          .insert({
            user_id: user.id,
            context: 'fitness',
            recommendation_text: data.response,
            confidence_score: confidenceScore,
            input_data: questionnaireData,
            recommendation_type: 'initial_assessment',
            metadata: {
              historical_data: historicalData,
              model_version: 'claude-3-opus-20240229'
            }
          });

        if (saveError) {
          console.error('Error saving recommendation:', saveError);
        }
      }

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
}
