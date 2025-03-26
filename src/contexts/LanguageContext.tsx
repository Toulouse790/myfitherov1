
import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { fr } from "@/i18n/fr";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es";
import { de } from "@/i18n/de";

type Language = "fr" | "en" | "es" | "de";
type Translations = typeof fr;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>("language", "fr");

  const translations = {
    fr,
    en,
    es,
    de,
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split(".");
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        return key;
      }
      current = current[k];
    }
    
    if (typeof current === "string" && params) {
      return Object.entries(params).reduce((acc, [key, value]) => {
        return acc.replace(`{${key}}`, String(value));
      }, current);
    }
    
    return current;
  };

  useEffect(() => {
    document.documentElement.lang = language;
    console.log("Language changed to:", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
