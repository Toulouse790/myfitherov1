
import { fr } from '@/i18n/fr';
import { en } from '@/i18n/en';
import { es } from '@/i18n/es';
import { de } from '@/i18n/de';
import { debugLogger } from './debug-logger';

type Language = 'fr' | 'en' | 'es' | 'de';

const translations = { fr, en, es, de };

const getAllKeys = (obj: any, path: string = ''): string[] => {
  let keys: string[] = [];
  
  for (const key in obj) {
    const newPath = path ? `${path}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = [...keys, ...getAllKeys(obj[key], newPath)];
    } else {
      keys.push(newPath);
    }
  }
  
  return keys;
};

const validateTranslations = () => {
  const allKeys = new Set<string>();
  const missingKeys: Record<Language, string[]> = {
    fr: [], en: [], es: [], de: []
  };

  // Collecte de toutes les clés uniques
  Object.values(translations).forEach(translation => {
    getAllKeys(translation).forEach(key => allKeys.add(key));
  });

  // Vérification des clés manquantes pour chaque langue
  allKeys.forEach(key => {
    (Object.keys(translations) as Language[]).forEach(lang => {
      const value = key.split('.').reduce((obj, k) => obj?.[k], translations[lang]);
      if (value === undefined) {
        missingKeys[lang].push(key);
        debugLogger.warn('TranslationValidator', `Clé manquante dans ${lang}:`, key);
      }
    });
  });

  return missingKeys;
};

export const checkTranslations = () => {
  if (process.env.NODE_ENV === 'development') {
    const missingKeys = validateTranslations();
    const hasMissingKeys = Object.values(missingKeys).some(keys => keys.length > 0);
    
    if (hasMissingKeys) {
      debugLogger.error('TranslationValidator', 'Clés de traduction manquantes détectées:', missingKeys);
      console.table(missingKeys);
    } else {
      debugLogger.log('TranslationValidator', 'Toutes les traductions sont synchronisées');
    }
  }
};
