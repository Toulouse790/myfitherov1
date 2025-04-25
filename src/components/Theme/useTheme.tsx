
import { useThemeContext } from "./ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Theme } from "./ThemeContext";

export function useTheme() {
  const { theme, setTheme } = useThemeContext();
  const { toast } = useToast();
  const { t } = useLanguage();

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
