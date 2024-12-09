import { supabase } from "@/integrations/supabase/client";

export const useAiTraining = () => {
  const logTrainingData = async (
    actionType: string,
    context: any,
    result?: string,
    feedback?: boolean
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Logging AI training data:", {
        actionType,
        context,
        result,
        feedback
      });

      const { data, error } = await supabase
        .from('ai_training_data')
        .insert({
          user_id: user.id,
          action_type: actionType,
          context: context,
          result: result,
          feedback: feedback
        })
        .select()
        .single();

      if (error) {
        console.error("Error logging training data:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in logTrainingData:", error);
      return null;
    }
  };

  return { logTrainingData };
};