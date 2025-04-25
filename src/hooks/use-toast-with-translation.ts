
import { useToast as useToastBase } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

export const useToastWithTranslation = () => {
  const { toast: baseToast } = useToastBase();
  const { t } = useLanguage();

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
        ? t(props.titleTranslationKey, { fallback: props.title })
        : props.title;
      
      const description = props.descriptionTranslationKey
        ? t(props.descriptionTranslationKey, { fallback: props.description })
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
      const title = t(titleKey, { fallback: titleKey.split('.').pop() || titleKey });
      const description = descriptionKey 
        ? t(descriptionKey, { fallback: descriptionKey.split('.').pop() || descriptionKey }) 
        : undefined;
      
      baseToast({
        title,
        description,
        ...options
      });
    } catch (error) {
      debugLogger.error('toastFromKey', `Error showing toast from keys: ${titleKey}, ${descriptionKey}`, error);
      
      // Fallback en cas d'erreur
      baseToast({
        title: titleKey.split('.').pop() || titleKey,
        description: descriptionKey ? (descriptionKey.split('.').pop() || descriptionKey) : undefined,
        ...options
      });
    }
  };

  return {
    toast,
    toastFromKey
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
    duration: props.duration,
    action: props.action
  });
};
