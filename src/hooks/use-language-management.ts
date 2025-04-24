
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
    
    // Mettre à jour le contexte global
    setLanguage(value as "fr" | "en" | "es" | "de");
    
    // Sauvegarder la préférence
    try {
      localStorage.setItem('userLanguage', value);
    } catch (error) {
      debugLogger.error('LanguageManagement', "Erreur lors de la sauvegarde de la préférence de langue", error);
    }
    
    // Messages de confirmation dans la langue sélectionnée
    const confirmMessages: Record<string, { title: string, description: string }> = {
      fr: { title: "Langue mise à jour", description: "La langue a été changée en Français" },
      en: { title: "Language updated", description: "Language has been changed to English" },
      es: { title: "Idioma actualizado", description: "El idioma ha sido cambiado a Español" },
      de: { title: "Sprache aktualisiert", description: "Die Sprache wurde auf Deutsch geändert" }
    };
    
    toast({
      title: confirmMessages[value]?.title || "Langue mise à jour",
      description: confirmMessages[value]?.description || `La langue a été changée en ${value}`,
    });
  };

  const translate = (key: string, options?: { fallback: string }) => {
    return t(key, options);
  };

  return {
    currentLanguage,
    changeLanguage,
    translate
  };
};
