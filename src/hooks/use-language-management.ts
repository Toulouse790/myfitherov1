
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "./use-toast";
import { debugLogger } from "@/utils/debug-logger";

export const useLanguageManagement = () => {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleLanguageChange = (newLanguage: "fr" | "en" | "es" | "de") => {
    debugLogger.log('LanguageManagement', `Changement de langue vers: ${newLanguage}`);
    
    if (newLanguage === language) return;

    try {
      setLanguage(newLanguage);
      localStorage.setItem('userLanguage', newLanguage);
      
      const messages = {
        fr: { title: "Langue mise à jour", description: "La langue a été changée en Français" },
        en: { title: "Language updated", description: "Language has been changed to English" },
        es: { title: "Idioma actualizado", description: "El idioma ha sido cambiado a Español" },
        de: { title: "Sprache aktualisiert", description: "Die Sprache wurde auf Deutsch geändert" }
      };

      toast({
        title: messages[newLanguage].title,
        description: messages[newLanguage].description,
      });
    } catch (error) {
      debugLogger.error('LanguageManagement', "Erreur lors du changement de langue", error);
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: t('settings.languageError'),
      });
    }
  };

  return {
    currentLanguage: language,
    changeLanguage: handleLanguageChange,
    translate: t,
  };
};
