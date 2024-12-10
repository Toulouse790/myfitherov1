import { supabase } from "@/integrations/supabase/client";

export const useAiTraining = () => {
  const logAiInteraction = async (
    actionType: string,
    context: any,
    result: string,
    modelName: string = 'gpt-3.5-turbo',
    inputTokens: number = 0,
    outputTokens: number = 0,
    responseTimeMs: number = 0,
    metadata: any = {},
    promptTemplate?: string
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { error } = await supabase
      .from('ai_training_data')
      .insert([
        {
          user_id: user.id,
          action_type: actionType,
          context,
          result,
          model_name: modelName,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          response_time_ms: responseTimeMs,
          metadata,
          prompt_template: promptTemplate,
          session_id: crypto.randomUUID()
        }
      ]);

    if (error) {
      console.error('Error logging AI interaction:', error);
    }
  };

  return { logAiInteraction };
};