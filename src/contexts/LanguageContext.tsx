
import React, { createContext, useContext, useState, useEffect } from 'react';
import { debugLogger } from '@/utils/debug-logger';
import { fr } from '@/i18n/fr';
import { en } from '@/i18n/en';
import { es } from '@/i18n/es';
import { de } from '@/i18n/de';

type Language = 'fr' | 'en' | 'es' | 'de';

interface Translations {
  [key: string]: any;
}

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { fallback?: string }) => string;
  getNestedTranslation: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations: Record<Language, Translations> = { fr, en, es, de };

const getNestedValue = (obj: any, path: string): string | undefined => {
  if (!obj || !path) return undefined;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) return undefined;
    result = result[key];
  }
  
  return typeof result === 'string' ? result : undefined;
};

const findTranslation = (
  key: string, 
  currentLanguage: Language, 
  fallbackText?: string
): string => {
  // Si la clé est vide, retourner le fallback ou une chaîne vide
  if (!key) return fallbackText || '';

  // 1. Essayer la langue actuelle
  const primaryTranslation = getNestedValue(translations[currentLanguage], key);
  if (primaryTranslation) {
    return primaryTranslation;
  }

  // 2. Si pas en français, essayer le français
  if (currentLanguage !== 'fr') {
    const frenchTranslation = getNestedValue(translations.fr, key);
    if (frenchTranslation) {
      debugLogger.warn('Translation', `[${currentLanguage.toUpperCase()}] Fallback to FR:`, { key, value: frenchTranslation });
      return frenchTranslation;
    }
  }

  // 3. Si pas en anglais, essayer l'anglais
  if (currentLanguage !== 'en') {
    const englishTranslation = getNestedValue(translations.en, key);
    if (englishTranslation) {
      debugLogger.warn('Translation', `[${currentLanguage.toUpperCase()}] Fallback to EN:`, { key, value: englishTranslation });
      return englishTranslation;
    }
  }

  // 4. Utiliser le fallback fourni ou la clé
  if (fallbackText !== undefined) {
    debugLogger.error('Translation', `[${currentLanguage.toUpperCase()}] Using fallback:`, { key, fallback: fallbackText });
    return fallbackText;
  }

  debugLogger.error('Translation', `[${currentLanguage.toUpperCase()}] No translation found:`, { key });
  // Afficher la clé sous forme lisible plutôt que la clé brute
  const lastPart = key.split('.').pop() || key;
  const readable = lastPart.replace(/([A-Z])/g, ' $1')
                           .replace(/^./, str => str.toUpperCase())
                           .replace(/[_.]/g, ' ');
  return readable;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    try {
      // Récupérer la langue stockée ou utiliser le français comme langue par défaut
      const storedLanguage = localStorage.getItem('userLanguage');
      if (storedLanguage && ['fr', 'en', 'es', 'de'].includes(storedLanguage)) {
        setLanguage(storedLanguage as Language);
      } else {
        // Si pas de langue stockée ou langue non valide, utiliser le français
        setLanguage('fr');
        localStorage.setItem('userLanguage', 'fr');
      }
      debugLogger.log('LanguageContext', `Langue initialisée: ${storedLanguage || 'fr'}`);
    } catch (error) {
      debugLogger.error('LanguageContext', "Erreur lors de la définition de la langue", error);
    }
  }, []);

  const translate = (key: string, options?: { fallback?: string }): string => {
    if (!key) return options?.fallback || '';
    return findTranslation(key, language, options?.fallback);
  };

  const getNestedTranslation = (key: string): any => {
    try {
      const keys = key.split('.');
      let result = translations[language];
      
      for (const k of keys) {
        if (!result || typeof result !== 'object') return {};
        result = result[k];
      }
      
      if (!result) {
        // Fallback to French
        result = translations.fr;
        for (const k of keys) {
          if (!result || typeof result !== 'object') return {};
          result = result[k];
        }
      }
      
      return result || {};
    } catch (error) {
      debugLogger.error('LanguageContext', `Erreur lors de l'accès aux traductions imbriquées: ${key}`, error);
      return {};
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t: translate,
      getNestedTranslation
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage doit être utilisé à l\'intérieur d\'un LanguageProvider');
  }
  return context;
};
