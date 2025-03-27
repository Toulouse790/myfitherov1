
import { useThemeContext } from "./ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Theme } from "./ThemeContext";

interface ThemeMessages {
  [key: string]: {
    title: string;
    description: string;
  };
}

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
    const messages: ThemeMessages = {
      light: {
        title: t("theme.lightEnabled"),
        description: t("theme.lightDescription"),
      },
      dark: {
        title: t("theme.darkEnabled"),
        description: t("theme.darkDescription"),
      },
      system: {
        title: t("theme.systemEnabled"),
        description: t("theme.systemDescription"),
      },
    };

    toast({
      title: messages[newTheme].title,
      description: messages[newTheme].description,
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
