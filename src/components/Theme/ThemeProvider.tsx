
import React, { createContext, useState, useEffect } from "react";
import { ThemeContext, Theme } from "./ThemeContext";
import { debugLogger } from "@/utils/debug-logger";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Récupère le thème depuis le localStorage ou utilise "light" par défaut
    const savedTheme = localStorage.getItem("theme") as Theme;
    
    // Si le thème n'est pas enregistré et que le système préfère le mode sombre, utiliser "dark"
    if (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    
    return savedTheme || "light";
  });

  // Mettre à jour le DOM quand le thème change
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Sauvegarder le thème dans le localStorage
    localStorage.setItem("theme", theme);
    
    // Émettre un événement pour la synchronisation
    const event = new CustomEvent('themeChanged', { detail: { theme } });
    window.dispatchEvent(event);
    
    debugLogger.log("ThemeProvider", `Thème changé à: ${theme}`);
  }, [theme]);

  // Observer les changements de préférence système
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        debugLogger.log("ThemeProvider", "Préférence système modifiée");
        if (mediaQuery.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    // Appliquer immédiatement si le thème est "system"
    if (theme === "system") {
      handleChange();
    }
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Fonction pour changer le thème
  const changeTheme = (newTheme: Theme) => {
    debugLogger.log("ThemeProvider", `Changement de thème: ${theme} => ${newTheme}`);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
