
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";
import { debugLogger } from "@/utils/debug-logger";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { language: contextLanguage, setLanguage: setContextLanguage } = useLanguage();

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
          
          // Utiliser la langue du contexte comme langue par défaut
          const storedLanguage = localStorage.getItem('userLanguage');
          const defaultLanguage = storedLanguage && ['fr', 'en', 'es', 'de'].includes(storedLanguage) 
            ? storedLanguage 
            : contextLanguage || 'fr';
            
          const defaultPreferences = {
            user_id: user.id,
            theme: 'system',
            language: defaultLanguage,
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
          
          // Synchroniser immédiatement avec le contexte de langue
          if (newData && newData.language && newData.language !== contextLanguage) {
            debugLogger.log("useUserPreferences", `Synchronizing language context from default preferences: ${newData.language}`);
            setContextLanguage(newData.language as "fr" | "en" | "es" | "de");
            localStorage.setItem('userLanguage', newData.language);
          }
          
          return newData;
        }

        // Synchroniser la langue du contexte avec celle des préférences utilisateur
        if (data && data.language && data.language !== contextLanguage) {
          debugLogger.log("useUserPreferences", `Synchronizing language context from DB: ${data.language}`);
          setContextLanguage(data.language as "fr" | "en" | "es" | "de");
          localStorage.setItem('userLanguage', data.language);
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

  // Effet pour synchroniser la langue lors des changements
  useEffect(() => {
    if (preferences?.language && preferences.language !== contextLanguage) {
      debugLogger.log("useUserPreferences", `Synchronizing language on preferences change: ${preferences.language}`);
      setContextLanguage(preferences.language as "fr" | "en" | "es" | "de");
      localStorage.setItem('userLanguage', preferences.language);
    }
  }, [preferences?.language, contextLanguage, setContextLanguage]);

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
        const storedLanguage = localStorage.getItem('userLanguage');
        const defaultLanguage = storedLanguage || contextLanguage || 'fr';

        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            theme: 'system',
            language: defaultLanguage,
            notifications_enabled: true,
            measurement_unit: 'metric',
            ...newPreferences
          });

        if (error) {
          debugLogger.error("useUserPreferences", "Error inserting preferences:", error);
          throw error;
        }
      }
      
      // Si la langue est mise à jour, synchroniser immédiatement avec le contexte
      if (newPreferences.language && newPreferences.language !== contextLanguage) {
        debugLogger.log("useUserPreferences", `Immediately updating language context: ${newPreferences.language}`);
        setContextLanguage(newPreferences.language as "fr" | "en" | "es" | "de");
        localStorage.setItem('userLanguage', newPreferences.language);
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
