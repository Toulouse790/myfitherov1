
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
  availableLanguages: { code: Language, name: string }[];
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations: Record<Language, Translations> = { fr, en, es, de };

// Liste des langues disponibles
const availableLanguages = [
  { code: 'fr' as Language, name: 'Français' },
  { code: 'en' as Language, name: 'English' },
  { code: 'es' as Language, name: 'Español' },
  { code: 'de' as Language, name: 'Deutsch' },
];

// Fonction utilitaire pour récupérer une valeur imbriquée dans un objet
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

  // 2. Si pas en français, essayer le français (langue principale)
  if (currentLanguage !== 'fr') {
    const frenchTranslation = getNestedValue(translations.fr, key);
    if (frenchTranslation) {
      debugLogger.warn('Translation', `[${currentLanguage.toUpperCase()}] Fallback to FR for key: ${key}`);
      return frenchTranslation;
    }
  }

  // 3. Si pas en anglais, essayer l'anglais (langue internationale)
  if (currentLanguage !== 'en') {
    const englishTranslation = getNestedValue(translations.en, key);
    if (englishTranslation) {
      debugLogger.warn('Translation', `[${currentLanguage.toUpperCase()}] Fallback to EN for key: ${key}`);
      return englishTranslation;
    }
  }

  // 4. Si ni français ni anglais, essayer les autres langues disponibles
  for (const lang of availableLanguages.map(l => l.code)) {
    if (lang !== currentLanguage && lang !== 'fr' && lang !== 'en') {
      const otherTranslation = getNestedValue(translations[lang], key);
      if (otherTranslation) {
        debugLogger.warn('Translation', `[${currentLanguage.toUpperCase()}] Fallback to ${lang.toUpperCase()} for key: ${key}`);
        return otherTranslation;
      }
    }
  }

  // 5. Utiliser le fallback fourni ou la clé
  if (fallbackText !== undefined) {
    debugLogger.warn('Translation', `[${currentLanguage.toUpperCase()}] Using fallback for key: ${key}`);
    return fallbackText;
  }

  // 6. Logging plus visible pour les clés manquantes en développement
  if (process.env.NODE_ENV === 'development') {
    console.warn(`🔴 MISSING TRANSLATION: [${currentLanguage.toUpperCase()}] Key: ${key}`);
  } else {
    debugLogger.error('Translation', `[${currentLanguage.toUpperCase()}] No translation found for key: ${key}`);
  }

  // Afficher la clé sous forme lisible plutôt que la clé brute
  const lastPart = key.split('.').pop() || key;
  const readable = lastPart.replace(/([A-Z])/g, ' $1')
                           .replace(/^./, str => str.toUpperCase())
                           .replace(/[_.]/g, ' ');
  return readable;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const [initialized, setInitialized] = useState(false);

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
      setInitialized(true);
    } catch (error) {
      debugLogger.error('LanguageContext', "Erreur lors de la définition de la langue", error);
      // Fallback en cas d'erreur
      setLanguage('fr');
      setInitialized(true);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    if (lang === language) return;
    
    debugLogger.log('LanguageContext', `Changement de langue: ${language} -> ${lang}`);
    
    try {
      // Mettre à jour l'état et le stockage local
      setLanguage(lang);
      localStorage.setItem('userLanguage', lang);
    } catch (error) {
      debugLogger.error('LanguageContext', "Erreur lors du changement de langue", error);
    }
  };

  const translate = (key: string, options?: { fallback?: string }): string => {
    if (!key) return options?.fallback || '';
    
    // Attendre l'initialisation avant de traduire
    if (!initialized) {
      return options?.fallback || key;
    }
    
    // Si key contient un paramètre {0}, {1}, etc., le remplacer par les paramètres options?.params
    const translation = findTranslation(key, language, options?.fallback);
    
    // Si les options contiennent des paramètres à substituer
    if (options?.params) {
      return translation.replace(/\{(\d+)\}/g, (_, index) => {
        const paramIndex = parseInt(index, 10);
        return options.params && options.params[paramIndex] !== undefined 
          ? String(options.params[paramIndex]) 
          : `{${index}}`;
      });
    }
    
    return translation;
  };

  const getNestedTranslation = (key: string): any => {
    try {
      // Attendre l'initialisation avant d'accéder aux traductions
      if (!initialized) return {};
      
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
      setLanguage: handleSetLanguage, 
      t: translate,
      getNestedTranslation,
      availableLanguages
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
