
import { ThemeSelector } from "@/components/Theme/ThemeSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface AppSettingsProps {
  language: string;
}

export const AppSettings = ({ language: initialLanguage }: AppSettingsProps) => {
  const { toast } = useToast();
  const { language: contextLanguage, setLanguage: setContextLanguage, t } = useLanguage();
  const [language, setLanguage] = useState(initialLanguage);

  // Synchroniser l'état local avec le contexte au chargement
  useEffect(() => {
    setLanguage(contextLanguage);
  }, [contextLanguage]);

  const handleLanguageChange = (value: string) => {
    // Mettre à jour l'état local et le contexte global
    setLanguage(value);
    setContextLanguage(value as "fr" | "en");
    
    toast({
      title: value === 'fr' ? "Langue mise à jour" : "Language updated",
      description: value === 'fr' 
        ? "La langue a été changée en Français" 
        : "Language has been changed to English",
    });
  };

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
              {t('settings.customizeAppearance')}
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
              {language === 'fr' ? 'Français' : 'English'}
            </Badge>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('settings.selectLanguage')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
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
