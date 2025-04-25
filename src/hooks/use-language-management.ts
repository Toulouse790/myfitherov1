
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";

export const useLanguageManagement = () => {
  const { language: currentLanguage, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const changeLanguage = (value: string) => {
    debugLogger.log('LanguageManagement', `Changement de langue vers: ${value}`);
    
    // Vérifier si la langue est valide
    if (!['fr', 'en', 'es', 'de'].includes(value)) {
      debugLogger.error('LanguageManagement', `Langue non supportée: ${value}`);
      return;
    }
    
    // Sauvegarder les messages de confirmation avant de changer de langue
    const confirmMessages: Record<string, { title: string, description: string }> = {
      fr: { 
        title: "Langue mise à jour", 
        description: "La langue a été changée en Français" 
      },
      en: { 
        title: "Language updated", 
        description: "Language has been changed to English" 
      },
      es: { 
        title: "Idioma actualizado", 
        description: "El idioma ha sido cambiado a Español" 
      },
      de: { 
        title: "Sprache aktualisiert", 
        description: "Die Sprache wurde auf Deutsch geändert" 
      }
    };
    
    // Récupérer le message de confirmation dans la nouvelle langue (que l'utilisateur va comprendre)
    const toastTitle = confirmMessages[value].title;
    const toastDescription = confirmMessages[value].description;
    
    // Mettre à jour le contexte global
    setLanguage(value as "fr" | "en" | "es" | "de");
    
    // Sauvegarder la préférence
    try {
      localStorage.setItem('userLanguage', value);
      
      // Déclencher un événement pour informer l'application du changement de langue
      const languageChangeEvent = new CustomEvent('languageChanged', { detail: { language: value } });
      window.dispatchEvent(languageChangeEvent);
    } catch (error) {
      debugLogger.error('LanguageManagement', "Erreur lors de la sauvegarde de la préférence de langue", error);
    }
    
    // Afficher le toast dans la NOUVELLE langue (après mise à jour)
    setTimeout(() => {
      toast({
        title: toastTitle,
        description: toastDescription,
      });
    }, 100);
  };

  const translate = (key: string, options?: { fallback?: string }) => {
    return t(key, options);
  };

  return {
    currentLanguage,
    changeLanguage,
    translate
  };
};
