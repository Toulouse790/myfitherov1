
import { useThemeContext } from "./ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Theme } from "./ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { debugLogger } from "@/utils/debug-logger";
import { useAuth } from "@/hooks/use-auth";

export function useTheme() {
  const { theme, setTheme } = useThemeContext();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Synchronisation du thème avec la base de données lors du changement
  useEffect(() => {
    const syncThemeWithDatabase = async () => {
      // Ne synchroniser que si l'utilisateur est connecté
      if (!user) return;

      try {
        const { error } = await supabase
          .from('user_preferences')
          .update({ theme, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);

        if (error) {
          debugLogger.error("ThemeSync", `Erreur lors de la synchronisation du thème: ${error.message}`);
        } else {
          debugLogger.log("ThemeSync", `Thème synchronisé avec la base de données: ${theme}`);
        }
      } catch (err) {
        debugLogger.error("ThemeSync", `Exception lors de la synchronisation du thème: ${err}`);
      }
    };

    // Appliquer la synchronisation avec un petit délai pour éviter trop d'appels
    const timer = setTimeout(() => {
      syncThemeWithDatabase();
    }, 500);

    return () => clearTimeout(timer);
  }, [theme, user]);

  const getThemeClass = (baseClass: string) => {
    return `${baseClass} ${theme === "dark" ? "dark" : "light"}`;
  };

  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    showThemeToast(newTheme);
  };

  const showThemeToast = (newTheme: Theme) => {
    // Utiliser directement les clés de traduction
    const titleKey = `theme.${newTheme}Enabled`;
    const descriptionKey = `theme.${newTheme}Description`;
    
    toast({
      title: t(titleKey),
      description: t(descriptionKey),
    });
  };

  const setThemeWithToast = (newTheme: Theme) => {
    setTheme(newTheme);
    showThemeToast(newTheme);
  };

  return {
    theme,
    setTheme: setThemeWithToast,
    toggleTheme,
    getThemeClass,
    isDark: theme === "dark",
    isLight: theme === "light",
    isSystem: theme === "system"
  };
}
