
import React, { createContext, useContext, useState } from 'react';

type Language = 'fr' | 'en';

interface Translations {
  [key: string]: string;
}

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

// Créer le contexte
const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Translations
const translations: Record<Language, Translations> = {
  fr: {
    // Commun
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.goBack': 'Retour',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',
    
    // Authentification
    'auth.signInRequired': 'Vous devez être connecté pour finaliser une session',
    
    // Entraînements
    'workouts.trainingSession': 'Séance d\'entraînement',
    'workouts.set': 'Série',
    'workouts.sets': 'séries',
    'workouts.setsCompleted': 'séries complétées',
    'workouts.sessionNotFound': 'Session non trouvée',
    'workouts.sessionNotFoundDescription': 'La session d\'entraînement demandée n\'existe pas ou n\'est plus disponible.',
    'workouts.completeWorkout': 'Terminer l\'entraînement',
    'workouts.completed': 'Terminé',
    'workouts.progress': 'Progression',
    'workouts.weight': 'Poids',
    'workouts.weightUnit': 'kg',
    'workouts.reps': 'Répétitions',
    'workouts.numberOfSets': 'Nombre de séries',
    'workouts.validateSet': 'Valider la série',
    'workouts.completeExercise': 'Terminer l\'exercice',
    'workouts.completedSets': 'Séries complétées',
    'workouts.restTime': 'Temps de repos',
    'workouts.skipRest': 'Passer le repos',
    'workouts.setCompleted': 'Série terminée',
    'workouts.caloriesBurned': 'calories brûlées',
    'workouts.restBeforeNextSet': 'Reposez-vous avant la prochaine série.',
    'workouts.exerciseCompleted': 'Exercice terminé',
    'workouts.allSetsCompleted': 'Toutes les séries sont terminées',
    'workouts.sessionSummary': 'Résumé de la séance',
    'workouts.duration': 'Durée',
    'workouts.minutes': 'min',
    'workouts.exercisesCompleted': 'Exercices terminés',
    'workouts.noActiveSession': 'Aucune session active trouvée',
    'workouts.weightUpdatedSuccessfully': 'Poids mis à jour avec succès',
    'workouts.repsUpdatedSuccessfully': 'Répétitions mises à jour avec succès',
    
    // Erreurs liées aux entraînements
    'workouts.errors.sessionCreationFailed': 'Impossible de créer la session d\'entraînement. Veuillez réessayer.',
    'workouts.errors.sessionFinalizeDescription': 'Impossible de finaliser la session',
    'workouts.errors.userNotAuthenticated': 'Utilisateur non authentifié',
    'workouts.errors.invalidWeightValue': 'Valeur de poids invalide',
    'workouts.errors.weightUpdateFailed': 'Impossible de mettre à jour le poids',
    'workouts.errors.invalidRepsValue': 'Valeur de répétitions invalide',
    'workouts.errors.repsUpdateFailed': 'Impossible de mettre à jour les répétitions'
  },
  en: {
    // Common
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.goBack': 'Go Back',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    
    // Authentication
    'auth.signInRequired': 'You must be logged in to finalize a session',
    
    // Workouts
    'workouts.trainingSession': 'Training Session',
    'workouts.set': 'Set',
    'workouts.sets': 'sets',
    'workouts.setsCompleted': 'sets completed',
    'workouts.sessionNotFound': 'Session Not Found',
    'workouts.sessionNotFoundDescription': 'The requested training session does not exist or is no longer available.',
    'workouts.completeWorkout': 'Complete Workout',
    'workouts.completed': 'Completed',
    'workouts.progress': 'Progress',
    'workouts.weight': 'Weight',
    'workouts.weightUnit': 'kg',
    'workouts.reps': 'Reps',
    'workouts.numberOfSets': 'Number of Sets',
    'workouts.validateSet': 'Validate Set',
    'workouts.completeExercise': 'Complete Exercise',
    'workouts.completedSets': 'Completed Sets',
    'workouts.restTime': 'Rest Time',
    'workouts.skipRest': 'Skip Rest',
    'workouts.setCompleted': 'Set Completed',
    'workouts.caloriesBurned': 'calories burned',
    'workouts.restBeforeNextSet': 'Rest before the next set.',
    'workouts.exerciseCompleted': 'Exercise Completed',
    'workouts.allSetsCompleted': 'All sets are completed',
    'workouts.sessionSummary': 'Session Summary',
    'workouts.duration': 'Duration',
    'workouts.minutes': 'min',
    'workouts.exercisesCompleted': 'Exercises Completed',
    'workouts.noActiveSession': 'No active session found',
    'workouts.weightUpdatedSuccessfully': 'Weight updated successfully',
    'workouts.repsUpdatedSuccessfully': 'Reps updated successfully',
    
    // Workout errors
    'workouts.errors.sessionCreationFailed': 'Failed to create training session. Please try again.',
    'workouts.errors.sessionFinalizeDescription': 'Failed to finalize session',
    'workouts.errors.userNotAuthenticated': 'User not authenticated',
    'workouts.errors.invalidWeightValue': 'Invalid weight value',
    'workouts.errors.weightUpdateFailed': 'Failed to update weight',
    'workouts.errors.invalidRepsValue': 'Invalid reps value',
    'workouts.errors.repsUpdateFailed': 'Failed to update reps'
  }
};

// Provider
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('fr');

  const translate = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
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
