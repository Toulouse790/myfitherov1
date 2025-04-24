
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
  // 1. Essayer la langue actuelle
  const primaryTranslation = getNestedValue(translations[currentLanguage], key);
  if (primaryTranslation) {
    debugLogger.log('Translation', `[${currentLanguage.toUpperCase()}] Found:`, { key, value: primaryTranslation });
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
  if (fallbackText) {
    debugLogger.error('Translation', `[${currentLanguage.toUpperCase()}] Using fallback:`, { key, fallback: fallbackText });
    return fallbackText;
  }

  debugLogger.error('Translation', `[${currentLanguage.toUpperCase()}] No translation found:`, { key });
  return key;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('userLanguage');
      
      if (savedLanguage && ['fr', 'en', 'es', 'de'].includes(savedLanguage)) {
        setLanguage(savedLanguage as Language);
        debugLogger.log('LanguageContext', `Langue chargée depuis localStorage: ${savedLanguage}`);
        return;
      }
      
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs: Language[] = ['fr', 'en', 'es', 'de'];
      
      const detectedLang = supportedLangs.includes(browserLang as Language) 
        ? browserLang as Language 
        : 'fr';
      
      setLanguage(detectedLang);
      debugLogger.log('LanguageContext', `Langue détectée du navigateur: ${detectedLang}`);
      
      localStorage.setItem('userLanguage', detectedLang);
    } catch (error) {
      debugLogger.error('LanguageContext', "Erreur lors de la détection de langue", error);
      setLanguage('fr');
    }
  }, []);

  const translate = (key: string, options?: { fallback?: string }): string => {
    return findTranslation(key, language, options?.fallback);
  };

  const getNestedTranslation = (key: string): any => {
    try {
      return getNestedValue(translations[language], key) || 
             getNestedValue(translations.fr, key) || 
             getNestedValue(translations.en, key) || 
             {};
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
