
import { useToast as useToastBase } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

export const useToastWithTranslation = () => {
  const { toast: baseToast } = useToastBase();
  
  // Utiliser un try/catch pour gérer le cas où le contexte de langue n'est pas disponible
  let t: (key: string, options?: { fallback?: string }) => string;
  let language: string = 'fr';
  
  try {
    const { t: translate, language: currentLanguage } = useLanguage();
    t = translate;
    language = currentLanguage;
  } catch (error) {
    debugLogger.warn('useToastWithTranslation', 'Le contexte de langue n\'est pas disponible', error);
    // Fonction de fallback qui renvoie simplement le fallback ou la clé
    t = (key: string, options?: { fallback?: string }) => options?.fallback || key;
    
    // Récupérer la langue du localStorage si possible
    try {
      const storedLanguage = localStorage.getItem('userLanguage');
      if (storedLanguage) {
        language = storedLanguage;
      }
    } catch (e) {
      // Ignorer les erreurs de localStorage
    }
  }

  const toast = (props: {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
    duration?: number;
    action?: React.ReactNode;
    titleTranslationKey?: string;
    descriptionTranslationKey?: string;
  }) => {
    try {
      // Si des clés de traduction sont fournies, les utiliser
      const title = props.titleTranslationKey 
        ? t(props.titleTranslationKey, { fallback: props.title || props.titleTranslationKey.split('.').pop() })
        : props.title;
      
      const description = props.descriptionTranslationKey
        ? t(props.descriptionTranslationKey, { fallback: props.description || props.descriptionTranslationKey.split('.').pop() })
        : props.description;
      
      // Appeler le toast de base avec les traductions
      baseToast({
        ...props,
        title,
        description,
      });
    } catch (error) {
      debugLogger.error('useToastWithTranslation', 'Error showing translated toast', error);
      
      // En cas d'erreur, utiliser le toast de base avec les valeurs d'origine
      baseToast(props);
    }
  };

  // Ajout d'une fonction pour créer des toasts à partir de clés de traduction uniquement
  const toastFromKey = (
    titleKey: string, 
    descriptionKey?: string, 
    options?: { 
      variant?: "default" | "destructive",
      duration?: number,
      action?: React.ReactNode
    }
  ) => {
    try {
      // Extraction d'une partie de la clé comme fallback plus lisible
      const extractReadableName = (key: string) => {
        const lastPart = key.split('.').pop() || key;
        return lastPart
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .replace(/[_.]/g, ' ')
          .trim();
      };
      
      const title = t(titleKey, { fallback: extractReadableName(titleKey) });
      const description = descriptionKey 
        ? t(descriptionKey, { fallback: extractReadableName(descriptionKey) }) 
        : undefined;
      
      baseToast({
        title,
        description,
        ...options,
        duration: options?.duration || 3000 // Durée par défaut réduite
      });
    } catch (error) {
      debugLogger.error('toastFromKey', `Error showing toast from keys: ${titleKey}, ${descriptionKey}`, error);
      
      // Fallback en cas d'erreur avec des clés plus lisibles
      baseToast({
        title: titleKey.split('.').pop() || titleKey,
        description: descriptionKey ? (descriptionKey.split('.').pop() || descriptionKey) : undefined,
        ...options
      });
    }
  };

  return {
    toast,
    toastFromKey,
    language
  };
};

// Exportons également une fonction pour les appels directs
export const toastWithTranslation = (props: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
  action?: React.ReactNode;
  titleTranslationKey?: string;
  descriptionTranslationKey?: string;
}) => {
  // Utilisation de la fonction importée directement
  const { toast } = useToastBase();
  
  // Récupérer la langue actuelle du localStorage pour le fallback
  let currentLanguage;
  try {
    currentLanguage = localStorage.getItem('userLanguage') || 'fr';
  } catch (error) {
    currentLanguage = 'fr';
  }
  
  // Fallback simple en cas d'appel direct
  toast({
    title: props.title || props.titleTranslationKey,
    description: props.description || props.descriptionTranslationKey,
    variant: props.variant,
    duration: props.duration || 3000, // Durée par défaut réduite
    action: props.action
  });
};
