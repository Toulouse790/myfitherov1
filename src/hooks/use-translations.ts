import { useLocalStorage } from "./use-local-storage";
import { fr } from "@/i18n/fr";
import { en } from "@/i18n/en";

const translations = {
  fr,
  en,
};

export type Language = keyof typeof translations;

export const useTranslations = () => {
  const [language, setLanguage] = useLocalStorage<Language>("language", "fr");

  const t = (key: string) => {
    const keys = key.split(".");
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        return key;
      }
      current = current[k];
    }
    
    return current;
  };

  return {
    language,
    setLanguage,
    t,
  };
};