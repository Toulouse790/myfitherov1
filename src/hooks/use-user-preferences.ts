
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { useToastWithTranslation } from "./use-toast-with-translation";
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
  const { toastFromKey } = useToastWithTranslation();
  const queryClient = useQueryClient();
  const { language: contextLanguage, setLanguage: setContextLanguage } = useLanguage();

  const { data: preferences, isLoading, error, refetch } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: async () => {
      if (!user) {
        debugLogger.log("useUserPreferences", "User not authenticated, returning null");
        return null;
      }
      
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
          
          try {
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
          } catch (err) {
            debugLogger.error("useUserPreferences", "RLS error or insertion error, returning default preferences without saving", err);
            // En cas d'erreur, retourner les préférences par défaut sans les sauvegarder
            return defaultPreferences;
          }
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
        // En cas d'erreur, retourner un objet de préférences par défaut
        const storedLanguage = localStorage.getItem('userLanguage');
        const defaultLanguage = storedLanguage && ['fr', 'en', 'es', 'de'].includes(storedLanguage) 
          ? storedLanguage 
          : contextLanguage || 'fr';
          
        return {
          user_id: user.id,
          theme: 'system',
          language: defaultLanguage,
          notifications_enabled: true,
          measurement_unit: 'metric',
        };
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

      try {
        // Si les préférences existent, mettre à jour
        if (preferences?.id) {
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

        // Retourner les préférences mises à jour pour une meilleure UX
        return { success: true };
      } catch (error) {
        debugLogger.error("useUserPreferences", "Error in updating preferences:", error);
        // Mettre à jour seulement le contexte local en cas d'erreur de mise à jour
        if (newPreferences.language) {
          setContextLanguage(newPreferences.language as "fr" | "en" | "es" | "de");
          localStorage.setItem('userLanguage', newPreferences.language);
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences', user?.id] });
      toastFromKey('settings.preferencesUpdated', 'settings.preferencesUpdated', {
        variant: "default"
      });
      refetch(); // Rafraîchir les préférences après la mise à jour
    },
    onError: (error) => {
      debugLogger.error("useUserPreferences", "Error in mutation:", error);
      toastFromKey('settings.errorSavingPreferences', 'settings.errorSavingPreferences', {
        variant: "destructive",
      });
    },
  });

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    refetch
  };
};
