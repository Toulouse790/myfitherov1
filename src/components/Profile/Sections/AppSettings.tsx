
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
  const { language: contextLanguage, setLanguage: setContextLanguage, t, availableLanguages } = useLanguage();
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage || contextLanguage);
  const { preferences, updatePreferences, isLoading } = useUserPreferences();

  // Synchroniser l'état local avec le contexte et les préférences
  useEffect(() => {
    if (preferences?.language) {
      debugLogger.log('AppSettings', `Setting language from preferences: ${preferences.language}`);
      setSelectedLanguage(preferences.language);
      
      if (preferences.language !== contextLanguage) {
        setContextLanguage(preferences.language as "fr" | "en" | "es" | "de");
      }
    } else if (contextLanguage !== selectedLanguage) {
      debugLogger.log('AppSettings', `Setting language from context: ${contextLanguage}`);
      setSelectedLanguage(contextLanguage);
    }
  }, [preferences, contextLanguage, setContextLanguage, selectedLanguage]);

  const getLanguageDisplayName = (code: string): string => {
    const languageMap: Record<string, string> = {
      fr: 'Français',
      en: 'English',
      es: 'Español',
      de: 'Deutsch'
    };
    return languageMap[code] || code;
  };

  const handleLanguageChange = (value: string) => {
    debugLogger.log('AppSettings', `Changement de langue vers: ${value}`);
    
    // Vérifier si la langue est valide
    if (!['fr', 'en', 'es', 'de'].includes(value)) {
      debugLogger.error('AppSettings', `Langue non supportée: ${value}`);
      return;
    }
    
    // Mettre à jour l'état local
    setSelectedLanguage(value);
    
    // Mettre à jour le contexte global
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
      description: confirmMessages[value]?.description || `La langue a été changée en ${getLanguageDisplayName(value)}`,
    });
  };

  // Si chargement, afficher un indicateur
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3 mb-6"></div>
        <div className="h-10 bg-muted rounded w-full mb-4"></div>
        <div className="h-6 bg-muted rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-xl font-semibold">
          {t('settings.appSettings')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('settings.configureAppearance')}
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {t('settings.theme')}
            </label>
            <Badge variant="outline" className="text-xs font-normal">
              {theme === 'light' 
                ? t('theme.lightMode') 
                : theme === 'dark' 
                  ? t('theme.darkMode') 
                  : t('theme.systemMode')}
            </Badge>
          </div>
          <ThemeSelector />
          <p className="text-xs text-muted-foreground mt-1">
            {t('settings.themeDescription')}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {t('settings.language')}
            </label>
            <Badge variant="outline" className="text-xs font-normal">
              {getLanguageDisplayName(selectedLanguage)}
            </Badge>
          </div>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('settings.selectLanguage')} />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map(({ code, name }) => (
                <SelectItem key={code} value={code}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {t('settings.languageDescription')}
          </p>
        </div>
      </div>
    </div>
  );
};
