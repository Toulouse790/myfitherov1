
import { ThemeSelector } from "@/components/Theme/ThemeSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/Theme/useTheme";
import { debugLogger } from "@/utils/debug-logger";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { Loader } from "@/components/ui/loader";
import { ErrorState } from "./ErrorState";

interface AppSettingsProps {
  language?: string;
}

export const AppSettings = ({ language: initialLanguage }: AppSettingsProps) => {
  const { language: contextLanguage, t, availableLanguages } = useLanguage();
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage || contextLanguage);
  const { preferences, updatePreferences, isLoading, error, refetch } = useUserPreferences();

  // Synchroniser l'état local avec les préférences récupérées
  useEffect(() => {
    if (preferences?.language) {
      debugLogger.log('AppSettings', `Setting language from preferences: ${preferences.language}`);
      setSelectedLanguage(preferences.language);
    } else if (initialLanguage && initialLanguage !== selectedLanguage) {
      debugLogger.log('AppSettings', `Setting language from prop: ${initialLanguage}`);
      setSelectedLanguage(initialLanguage);
    } else if (contextLanguage !== selectedLanguage) {
      debugLogger.log('AppSettings', `Setting language from context: ${contextLanguage}`);
      setSelectedLanguage(contextLanguage);
    }
  }, [preferences?.language, contextLanguage, initialLanguage, selectedLanguage]);

  const getLanguageDisplayName = (code: string): string => {
    const language = availableLanguages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  const handleLanguageChange = (value: string) => {
    try {
      debugLogger.log('AppSettings', `Changement de langue vers: ${value}`);
      
      // Vérifier si la langue est valide
      if (!availableLanguages.some(lang => lang.code === value)) {
        debugLogger.error('AppSettings', `Langue non supportée: ${value}`);
        return;
      }
      
      // Mettre à jour l'état local
      setSelectedLanguage(value);
      
      // Sauvegarder les préférences utilisateur
      updatePreferences({ language: value });
    } catch (error) {
      debugLogger.error('AppSettings', `Erreur lors du changement de langue: ${error}`);
    }
  };

  // Si erreur de chargement, afficher un message d'erreur avec option de réessayer
  if (error) {
    return (
      <ErrorState 
        title={t('settings.somethingWentWrong')}
        message={t('settings.errorLoadingPreferences')}
        onRetry={() => refetch()}
      />
    );
  }

  // Si chargement, afficher un indicateur
  if (isLoading) {
    return (
      <div className="space-y-6 py-4 flex items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto h-8 w-8 mb-2" />
          <p className="text-sm text-muted-foreground">{t('common.loadingPreferences')}</p>
        </div>
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
