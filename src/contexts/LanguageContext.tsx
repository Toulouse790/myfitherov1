
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

interface LanguageProviderProps {
  children: React.ReactNode;
}

// Créer le contexte
const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Translations complètes
const translations: Record<Language, Translations> = {
  fr,
  en,
  es,
  de
};

// Fonction pour accéder à une clé de traduction imbriquée
const getNestedValue = (obj: any, path: string) => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) return undefined;
    result = result[key];
  }
  
  return result;
};

// Provider
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('fr');

  // Détection de la langue du navigateur et chargement des préférences
  useEffect(() => {
    try {
      // Essayer de charger depuis localStorage
      const savedLanguage = localStorage.getItem('userLanguage');
      
      if (savedLanguage && ['fr', 'en', 'es', 'de'].includes(savedLanguage)) {
        setLanguage(savedLanguage as Language);
        debugLogger.log('LanguageContext', `Langue chargée depuis localStorage: ${savedLanguage}`);
        return;
      }
      
      // Sinon, utiliser la langue du navigateur
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs: Language[] = ['fr', 'en', 'es', 'de'];
      
      // Vérifier si la langue du navigateur est supportée
      const detectedLang = supportedLangs.includes(browserLang as Language) 
        ? browserLang as Language 
        : 'fr';
      
      setLanguage(detectedLang);
      debugLogger.log('LanguageContext', `Langue détectée du navigateur: ${detectedLang}`);
      
      // Enregistrer la préférence
      localStorage.setItem('userLanguage', detectedLang);
    } catch (error) {
      debugLogger.error('LanguageContext', "Erreur lors de la détection de langue", error);
      // Fallback sur français en cas d'erreur
      setLanguage('fr');
    }
  }, []);

  // Sauvegarder la préférence de langue lorsqu'elle change
  useEffect(() => {
    try {
      localStorage.setItem('userLanguage', language);
      debugLogger.log('LanguageContext', `Langue sauvegardée: ${language}`);
    } catch (error) {
      debugLogger.error('LanguageContext', "Erreur lors de la sauvegarde de la langue", error);
    }
  }, [language]);

  // Fonction de traduction améliorée
  const translate = (key: string, options?: { fallback?: string }): string => {
    try {
      const value = getNestedValue(translations[language], key);
      
      // Si la traduction existe, la retourner
      if (value !== undefined && typeof value === 'string') {
        return value;
      }
      
      // Sinon, utiliser le fallback ou la clé
      if (options?.fallback) {
        return options.fallback;
      }
      
      // Si aucune traduction trouvée, essayer en anglais comme backup
      if (language !== 'en') {
        const enValue = getNestedValue(translations['en'], key);
        if (enValue !== undefined && typeof enValue === 'string') {
          return enValue;
        }
      }
      
      // Dernier recours: retourner la clé
      return key;
    } catch (error) {
      debugLogger.error('LanguageContext', `Erreur de traduction pour la clé: ${key}`, error);
      return options?.fallback || key;
    }
  };

  // Fonction pour obtenir une section de traduction complète (pour les objets imbriqués)
  const getNestedTranslation = (key: string): any => {
    try {
      return getNestedValue(translations[language], key) || getNestedValue(translations['en'], key) || {};
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

// Hook pour utiliser le contexte
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage doit être utilisé à l\'intérieur d\'un LanguageProvider');
  }
  return context;
};
