import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";

export interface UserPreferences {
  id: string;
  user_id: string;
  measurement_unit: string;
  notifications_enabled: boolean;
  training_days: string[];
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log("[DEBUG] Fetching preferences for user:", user.id);
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('[DEBUG] Error fetching preferences:', error);
        throw error;
      }

      console.log("[DEBUG] Fetched preferences:", data);
      return data;
    },
    enabled: !!user
  });

  const { mutate: updatePreferences } = useMutation({
    mutationFn: async (newPreferences: Partial<UserPreferences>) => {
      if (!user) throw new Error('User not authenticated');

      console.log("[DEBUG] Updating preferences for user:", user.id);
      console.log("[DEBUG] New preferences:", newPreferences);

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...newPreferences
        });

      if (error) {
        console.error('[DEBUG] Error updating preferences:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences', user?.id] });
      toast({
        title: "Succès",
        description: "Vos préférences ont été mises à jour.",
      });
    },
    onError: (error) => {
      console.error('[DEBUG] Error in mutation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos préférences.",
        variant: "destructive",
      });
    },
  });

  return {
    preferences,
    isLoading,
    updatePreferences,
  };
};