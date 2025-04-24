
import { fr } from '@/i18n/fr';
import { en } from '@/i18n/en';
import { es } from '@/i18n/es';
import { de } from '@/i18n/de';
import { debugLogger } from './debug-logger';

type Language = 'fr' | 'en' | 'es' | 'de';
type TranslationReport = {
  missingKeys: Record<Language, string[]>;
  inconsistentKeys: Array<{
    key: string;
    languages: Language[];
    values: Record<Language, string>;
  }>;
  totalKeys: number;
  coverage: Record<Language, number>;
};

const translations = { fr, en, es, de };

const getAllKeys = (obj: any, path: string = ''): string[] => {
  let keys: string[] = [];
  
  for (const key in obj) {
    const newPath = path ? `${path}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = [...keys, ...getAllKeys(obj[key], newPath)];
    } else if (typeof obj[key] === 'string') {
      keys.push(newPath);
    }
  }
  
  return keys;
};

const validateTranslations = (): TranslationReport => {
  const allKeys = new Set<string>();
  const report: TranslationReport = {
    missingKeys: { fr: [], en: [], es: [], de: [] },
    inconsistentKeys: [],
    totalKeys: 0,
    coverage: { fr: 0, en: 0, es: 0, de: 0 }
  };

  // Collecte de toutes les clés
  Object.values(translations).forEach(translation => {
    getAllKeys(translation).forEach(key => allKeys.add(key));
  });

  report.totalKeys = allKeys.size;

  // Vérification des traductions
  allKeys.forEach(key => {
    const values: Record<Language, string | undefined> = {
      fr: undefined,
      en: undefined,
      es: undefined,
      de: undefined
    };

    let hasInconsistency = false;
    const presentIn: Language[] = [];

    (Object.keys(translations) as Language[]).forEach(lang => {
      const value = key.split('.').reduce((obj, k) => obj?.[k], translations[lang]);
      values[lang] = typeof value === 'string' ? value : undefined;

      if (value === undefined) {
        report.missingKeys[lang].push(key);
      } else {
        presentIn.push(lang);
      }

      if (value !== undefined && typeof value !== 'string') {
        hasInconsistency = true;
      }
    });

    if (hasInconsistency) {
      report.inconsistentKeys.push({
        key,
        languages: presentIn,
        values: values as Record<Language, string>
      });
    }
  });

  // Calcul de la couverture
  Object.keys(report.missingKeys).forEach(lang => {
    const missing = report.missingKeys[lang as Language].length;
    report.coverage[lang as Language] = Math.round(((report.totalKeys - missing) / report.totalKeys) * 100);
  });

  return report;
};

export const checkTranslations = () => {
  if (process.env.NODE_ENV === 'development') {
    const report = validateTranslations();
    
    debugLogger.log('TranslationValidator', 'Rapport de validation des traductions:', report);

    if (Object.values(report.missingKeys).some(keys => keys.length > 0)) {
      debugLogger.warn('TranslationValidator', 'Clés manquantes détectées:');
      console.table(report.missingKeys);
    }

    if (report.inconsistentKeys.length > 0) {
      debugLogger.warn('TranslationValidator', 'Incohérences détectées:');
      console.table(report.inconsistentKeys);
    }

    debugLogger.log('TranslationValidator', 'Couverture des traductions:');
    console.table(report.coverage);
    
    // Si plus de 10% des clés manquent dans une langue, afficher un avertissement
    Object.entries(report.coverage).forEach(([lang, coverage]) => {
      if (coverage < 90) {
        debugLogger.error('TranslationValidator', `ATTENTION: La langue ${lang.toUpperCase()} a une couverture de traduction basse (${coverage}%)`);
      }
    });
  }
};

// Exécuter la validation au chargement du module
checkTranslations();
