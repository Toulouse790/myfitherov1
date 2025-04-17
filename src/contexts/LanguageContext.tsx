
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Définir les langues disponibles
export type Language = 'fr' | 'en';

// Structure des traductions
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Traductions
const translations: Translations = {
  fr: {
    // Éléments de navigation
    'nav.home': 'Accueil',
    'nav.workouts': 'Entraînements',
    'nav.nutrition': 'Nutrition',
    'nav.sleep': 'Sommeil',
    'nav.profile': 'Profil',
    
    // Textes communs
    'common.back': 'Retour',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    
    // Éléments d'entraînement
    'workouts.title': 'Entraînements',
    'workouts.activeSession': 'Session active',
    'workouts.trackProgressDescription': 'Suivez vos progrès et améliorez vos performances',
    'workouts.continueSession': 'Continuer',
    'workouts.startSession': 'Commencer',
    'workouts.home': 'Accueil',
    'workouts.library': 'Bibliothèque',
    'workouts.progress': 'Progression',
    'workouts.stats': 'Statistiques',
    'workouts.exerciseLibrary': 'exercices',
    'workouts.addWorkout': 'Ajouter un entraînement',
    'workouts.noWorkoutsYet': 'Pas encore d\'entraînements',
    'workouts.createFirst': 'Créez votre premier entraînement',
    'workouts.set': 'Série',
    'workouts.sets': 'Séries',
    'workouts.reps': 'Répétitions',
    'workouts.weight': 'Poids',
    'workouts.weightUnit': '(kg)',
    'workouts.rest': 'Repos',
    'workouts.restTime': 'Temps de repos',
    'workouts.skipRest': 'Passer le repos',
    'workouts.completeExercise': 'Terminer l\'exercice',
    'workouts.validateSet': 'Valider la série',
    'workouts.addSet': 'Ajouter une série',
    'workouts.setCompleted': 'Série complétée',
    'workouts.exerciseCompleted': 'Exercice terminé',
    'workouts.allSetsCompleted': 'Toutes les séries ont été complétées',
    'workouts.caloriesBurned': 'calories brûlées',
    'workouts.restBeforeNextSet': 'Repos avant la prochaine série',
    'workouts.completedSets': 'Séries complétées',
    'workouts.numberOfSets': 'Nombre de séries',
    'workouts.progress': 'Progression',
    'workouts.stopWorkout': 'Arrêter l\'entraînement',
    'workouts.newPersonalRecord': 'Nouveau record personnel: {{weight}}kg!',
    'workouts.setValidated': 'Série validée avec {{weight}}kg',
    'workouts.errors.weightUpdateFailed': 'Impossible de mettre à jour le poids.',
    'workouts.errors.repsUpdateFailed': 'Impossible de mettre à jour les répétitions.',
    'workouts.errors.sessionFinalizeDescription': 'Impossible de terminer la séance',
    'workouts.errors.saveWeightFailed': 'Impossible de sauvegarder le poids',
  },
  en: {
    // Navigation elements
    'nav.home': 'Home',
    'nav.workouts': 'Workouts',
    'nav.nutrition': 'Nutrition',
    'nav.sleep': 'Sleep',
    'nav.profile': 'Profile',
    
    // Common texts
    'common.back': 'Back',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Workout elements
    'workouts.title': 'Workouts',
    'workouts.activeSession': 'Active session',
    'workouts.trackProgressDescription': 'Track your progress and improve your performance',
    'workouts.continueSession': 'Continue',
    'workouts.startSession': 'Start',
    'workouts.home': 'Home',
    'workouts.library': 'Library',
    'workouts.progress': 'Progress',
    'workouts.stats': 'Stats',
    'workouts.exerciseLibrary': 'exercises',
    'workouts.addWorkout': 'Add workout',
    'workouts.noWorkoutsYet': 'No workouts yet',
    'workouts.createFirst': 'Create your first workout',
    'workouts.set': 'Set',
    'workouts.sets': 'Sets',
    'workouts.reps': 'Reps',
    'workouts.weight': 'Weight',
    'workouts.weightUnit': '(kg)',
    'workouts.rest': 'Rest',
    'workouts.restTime': 'Rest time',
    'workouts.skipRest': 'Skip rest',
    'workouts.completeExercise': 'Complete exercise',
    'workouts.validateSet': 'Validate set',
    'workouts.addSet': 'Add set',
    'workouts.setCompleted': 'Set completed',
    'workouts.exerciseCompleted': 'Exercise completed',
    'workouts.allSetsCompleted': 'All sets have been completed',
    'workouts.caloriesBurned': 'calories burned',
    'workouts.restBeforeNextSet': 'Rest before next set',
    'workouts.completedSets': 'Completed sets',
    'workouts.numberOfSets': 'Number of sets',
    'workouts.progress': 'Progress',
    'workouts.stopWorkout': 'Stop workout',
    'workouts.newPersonalRecord': 'New personal record: {{weight}}kg!',
    'workouts.setValidated': 'Set validated with {{weight}}kg',
    'workouts.errors.weightUpdateFailed': 'Unable to update weight.',
    'workouts.errors.repsUpdateFailed': 'Unable to update repetitions.',
    'workouts.errors.sessionFinalizeDescription': 'Unable to complete the session',
    'workouts.errors.saveWeightFailed': 'Unable to save weight',
  }
};

// Contexte de langue
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider du contexte
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('fr');

  // Récupérer la langue sauvegardée lors du chargement initial
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Sauvegarder la langue lorsqu'elle change
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Fonction de traduction
  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[language]?.[key] || key;
    
    // Remplacer les paramètres s'ils existent
    if (params) {
      return Object.entries(params).reduce((acc, [param, value]) => {
        return acc.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
      }, translation);
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
