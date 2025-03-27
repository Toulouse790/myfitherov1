
import React, { createContext, useState, useEffect } from "react";
import { ThemeContext, Theme } from "./ThemeContext";

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
  }, [theme]);

  // Observer les changements de préférence système
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        if (mediaQuery.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Fonction pour changer le thème
  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
