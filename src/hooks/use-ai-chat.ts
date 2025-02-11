
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useAiTraining } from "@/hooks/use-ai-training";

export const useAiChat = () => {
  const { user } = useAuth();
  const { logAiInteraction } = useAiTraining();

  const sendMessage = async (content: string) => {
    if (!user) {
      throw new Error("User must be authenticated to use AI chat");
    }

    const startTime = performance.now();

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-anthropic', {
        body: { content }
      });

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Log the interaction for analytics
      await logAiInteraction(
        'chat',
        { message: content },
        data.response,
        'claude-3-opus-20240229',
        content.length,
        data.response.length,
        responseTime
      );

      if (error) throw error;
      return data.response;

    } catch (error) {
      console.error('Error in AI chat:', error);
      throw error;
    }
  };

  return { sendMessage };
};
