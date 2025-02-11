
import { useQuery } from "@tanstack/react-query";
import { ClaudeService, ClaudeResponse } from "@/services/claude-service";
import { useToast } from "@/hooks/use-toast";

export const useClaudeRecommendations = (questionnaireData: any) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['claude-recommendations', questionnaireData],
    queryFn: async (): Promise<ClaudeResponse> => {
      try {
        return await ClaudeService.getPersonalizedRecommendations(questionnaireData);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de générer les recommandations. Veuillez réessayer.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!questionnaireData,
    staleTime: 24 * 60 * 60 * 1000, // Cache pendant 24h
  });
};
