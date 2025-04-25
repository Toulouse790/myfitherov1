
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

  return {
    toast,
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
  
  // Récupérer la langue actuelle du localStorage
  let currentLanguage;
  try {
    currentLanguage = localStorage.getItem('userLanguage') || 'fr';
  } catch (error) {
    currentLanguage = 'fr';
  }
  
  // Tenter d'importer dynamiquement les traductions
  // Note: Ceci est une solution simplifiée, mieux vaut utiliser le hook dans les composants
  toast(props);
};
