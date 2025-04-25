
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";
import { debugLogger } from "@/utils/debug-logger";

export interface UserPreferences {
  id?: string;
  user_id: string;
  theme: string;
  language: string;
  notifications_enabled: boolean;
  measurement_unit: string;
  created_at?: string;
  updated_at?: string;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading, error } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      debugLogger.log("useUserPreferences", "Fetching preferences for user:", user.id);
      
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          debugLogger.error("useUserPreferences", "Error fetching preferences:", error);
          throw error;
        }

        // Si aucune préférence n'existe, créer des préférences par défaut
        if (!data) {
          debugLogger.log("useUserPreferences", "No preferences found, creating default preferences");
          
          const defaultPreferences = {
            user_id: user.id,
            theme: 'system',
            language: 'fr',
            notifications_enabled: true,
            measurement_unit: 'metric',
          };
          
          const { data: newData, error: insertError } = await supabase
            .from('user_preferences')
            .insert(defaultPreferences)
            .select()
            .single();
            
          if (insertError) {
            debugLogger.error("useUserPreferences", "Error creating default preferences:", insertError);
            throw insertError;
          }
          
          debugLogger.log("useUserPreferences", "Created default preferences:", newData);
          return newData;
        }

        debugLogger.log("useUserPreferences", "Fetched preferences:", data);
        return data;
      } catch (catchError) {
        debugLogger.error("useUserPreferences", "Exception in fetching preferences:", catchError);
        throw catchError;
      }
    },
    enabled: !!user,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { mutate: updatePreferences } = useMutation({
    mutationFn: async (newPreferences: Partial<UserPreferences>) => {
      if (!user) throw new Error('User not authenticated');

      debugLogger.log("useUserPreferences", "Updating preferences for user:", user.id);
      debugLogger.log("useUserPreferences", "New preferences:", newPreferences);

      // Si les préférences existent, mettre à jour
      if (preferences) {
        const { error } = await supabase
          .from('user_preferences')
          .update({
            ...newPreferences,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) {
          debugLogger.error("useUserPreferences", "Error updating preferences:", error);
          throw error;
        }
      } 
      // Sinon, créer de nouvelles préférences
      else {
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            theme: 'system',
            language: 'fr',
            notifications_enabled: true,
            measurement_unit: 'metric',
            ...newPreferences
          });

        if (error) {
          debugLogger.error("useUserPreferences", "Error inserting preferences:", error);
          throw error;
        }
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
      debugLogger.error("useUserPreferences", "Error in mutation:", error);
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
    error,
    updatePreferences,
  };
};
