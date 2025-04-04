
import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { fr } from "@/i18n/fr";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es";
import { de } from "@/i18n/de";
import { debugLogger } from "@/utils/debug-logger";

type Language = "fr" | "en" | "es" | "de";
type Translations = typeof fr;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: { fallback?: string } & Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Correction ici: ajout du paramètre 'window.navigator.language.split('-')[0] === 'fr' ? "fr" : "en"' pour la valeur par défaut
  const [language, setLanguage] = useLocalStorage<Language>("language", 
    window.navigator.language.split('-')[0] === 'fr' ? "fr" : 
    window.navigator.language.split('-')[0] === 'es' ? "es" : 
    window.navigator.language.split('-')[0] === 'de' ? "de" : "en"
  );

  const translations = {
    fr,
    en,
    es,
    de,
  };

  const t = (key: string, params?: { fallback?: string } & Record<string, string | number>) => {
    try {
      const keys = key.split(".");
      let current: any = translations[language];
      
      for (const k of keys) {
        if (current[k] === undefined) {
          debugLogger.warn(`Translation missing for key: ${key} in language: ${language}`);
          
          // Essayez de trouver la clé dans une autre langue si la fallback n'est pas spécifiée
          if (!params?.fallback) {
            // Tenter d'utiliser l'anglais comme langue de secours
            if (language !== 'en') {
              let enCurrent = translations.en;
              let enFound = true;
              for (const enKey of keys) {
                if (enCurrent[enKey] === undefined) {
                  enFound = false;
                  break;
                }
                enCurrent = enCurrent[enKey];
              }
              if (enFound && typeof enCurrent === 'string') {
                return enCurrent;
              }
            }
          }
          
          return params?.fallback || key;
        }
        current = current[k];
      }
      
      if (typeof current === "string" && params) {
        return Object.entries(params).reduce((acc, [paramKey, value]) => {
          if (paramKey !== "fallback") {
            return acc.replace(`{${paramKey}}`, String(value));
          }
          return acc;
        }, current);
      }
      
      return current;
    } catch (error) {
      debugLogger.error("Translation error", error);
      return params?.fallback || key;
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    debugLogger.log("Language", `Language changed to: ${language}`);
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
