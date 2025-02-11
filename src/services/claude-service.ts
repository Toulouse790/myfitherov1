
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
  private static generateQuestionnairePrompt(data: QuestionnaireData): string {
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

Fournis des recommandations détaillées pour :
1. Plan d'entraînement adapté
2. Conseils nutritionnels personnalisés
3. Objectifs réalistes à court et moyen terme
4. Points d'attention particuliers`;
  }

  static async getPersonalizedRecommendations(questionnaireData: QuestionnaireData): Promise<ClaudeResponse> {
    try {
      console.log("Generating recommendations for:", questionnaireData);
      
      const prompt = this.generateQuestionnairePrompt(questionnaireData);
      
      const { data, error } = await supabase.functions.invoke('chat-with-anthropic', {
        body: { content: prompt }
      });

      if (error) {
        console.error('Error getting recommendations:', error);
        throw error;
      }

      return {
        response: data.response,
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Error in Claude service:', error);
      throw error;
    }
  }
}
