
import { Sun, Moon, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./useTheme";
import { useLanguage } from "@/contexts/LanguageContext";
import { Theme } from "./ThemeContext";

interface ThemeSelectorProps {
  variant?: "default" | "minimal" | "iconOnly";
  size?: "default" | "sm" | "lg";
}

export const ThemeSelector = ({ 
  variant = "default", 
  size = "default" 
}: ThemeSelectorProps) => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant={theme === "light" ? "default" : "outline"}
          size="icon"
          onClick={() => handleThemeChange("light")}
          aria-label={t("theme.lightMode")}
        >
          <Sun className="h-4 w-4" />
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "outline"}
          size="icon"
          onClick={() => handleThemeChange("dark")}
          aria-label={t("theme.darkMode")}
        >
          <Moon className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (variant === "iconOnly") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleThemeChange(theme === "light" ? "dark" : "light")}
        aria-label={theme === "light" ? t("theme.switchToDark") : t("theme.switchToLight")}
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size={size}
        onClick={() => handleThemeChange("light")}
        className={theme === "light" ? "bg-primary/10" : ""}
      >
        <Sun className="h-4 w-4 mr-1" />
        {t("theme.lightMode")}
      </Button>
      <Button
        variant="outline"
        size={size}
        onClick={() => handleThemeChange("dark")}
        className={theme === "dark" ? "bg-primary/10" : ""}
      >
        <Moon className="h-4 w-4 mr-1" />
        {t("theme.darkMode")}
      </Button>
      <Button
        variant="outline"
        size={size}
        onClick={() => handleThemeChange("system")}
        className={theme === "system" ? "bg-primary/10" : ""}
      >
        <Palette className="h-4 w-4 mr-1" />
        {t("theme.systemMode")}
      </Button>
    </div>
  );
};
