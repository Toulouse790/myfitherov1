
import { ThemeSelector } from "@/components/Theme/ThemeSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/Theme/useTheme";
import { debugLogger } from "@/utils/debug-logger";
import { useUserPreferences } from "@/hooks/use-user-preferences";

interface AppSettingsProps {
  language?: string;
}

export const AppSettings = ({ language: initialLanguage }: AppSettingsProps) => {
  const { toast } = useToast();
  const { language: contextLanguage, setLanguage: setContextLanguage, t } = useLanguage();
  const { theme } = useTheme();
  const [language, setLanguage] = useState<string>(initialLanguage || contextLanguage);
  const { preferences, updatePreferences } = useUserPreferences();

  // Synchroniser l'état local avec le contexte au chargement
  useEffect(() => {
    setLanguage(contextLanguage);
  }, [contextLanguage]);

  // Synchroniser avec les préférences de la base de données
  useEffect(() => {
    if (preferences?.language) {
      setLanguage(preferences.language);
      setContextLanguage(preferences.language as "fr" | "en" | "es" | "de");
    }
  }, [preferences, setContextLanguage]);

  const handleLanguageChange = (value: string) => {
    debugLogger.log('AppSettings', `Changement de langue vers: ${value}`);
    
    // Vérifier si la langue est valide
    if (!['fr', 'en', 'es', 'de'].includes(value)) {
      debugLogger.error('AppSettings', `Langue non supportée: ${value}`);
      return;
    }
    
    // Mettre à jour l'état local et le contexte global
    setLanguage(value);
    setContextLanguage(value as "fr" | "en" | "es" | "de");
    
    // Sauvegarder dans la base de données
    updatePreferences({ language: value });
    
    // Sauvegarder la préférence locale
    try {
      localStorage.setItem('userLanguage', value);
    } catch (error) {
      debugLogger.error('AppSettings', "Erreur lors de la sauvegarde de la préférence de langue", error);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-xl font-semibold">
          {t('settings.appSettings', { fallback: 'Paramètres de l\'application' })}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('settings.configureAppearance', { fallback: 'Configurez l\'apparence de l\'application' })}
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {t('settings.theme', { fallback: 'Thème' })}
            </label>
            <Badge variant="outline" className="text-xs font-normal">
              {theme === 'light' 
                ? t('theme.lightMode', { fallback: 'Mode clair' }) 
                : theme === 'dark' 
                  ? t('theme.darkMode', { fallback: 'Mode sombre' }) 
                  : t('theme.systemMode', { fallback: 'Mode système' })}
            </Badge>
          </div>
          <ThemeSelector />
          <p className="text-xs text-muted-foreground mt-1">
            {t('settings.themeDescription', { fallback: 'Choisissez le thème qui vous convient le mieux' })}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {t('settings.language', { fallback: 'Langue' })}
            </label>
            <Badge variant="outline" className="text-xs font-normal">
              {language === 'fr' ? 'Français' : 
               language === 'en' ? 'English' : 
               language === 'es' ? 'Español' : 
               language === 'de' ? 'Deutsch' : 'Français'}
            </Badge>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('settings.selectLanguage', { fallback: 'Sélectionner une langue' })} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {t('settings.languageDescription', { fallback: 'Choisissez la langue de l\'interface' })}
          </p>
        </div>
      </div>
    </div>
  );
};
