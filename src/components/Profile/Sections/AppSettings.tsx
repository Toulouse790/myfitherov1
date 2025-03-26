
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
  const { language: contextLanguage, setLanguage: setContextLanguage } = useLanguage();
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
          {language === 'fr' ? "Paramètres de l'application" : "Application Settings"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {language === 'fr' 
            ? "Configurez l'apparence et la langue de l'application" 
            : "Configure the appearance and language of the application"}
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {language === 'fr' ? "Thème" : "Theme"}
            </label>
            <Badge variant="outline" className="text-xs font-normal">
              {language === 'fr' ? "Personnaliser l'apparence" : "Customize appearance"}
            </Badge>
          </div>
          <ThemeSelector />
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'fr' 
              ? "Changez entre le mode clair, sombre ou utilisez les paramètres système" 
              : "Switch between light, dark or use system settings"}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {language === 'fr' ? "Langue" : "Language"}
            </label>
            <Badge variant="outline" className="text-xs font-normal">
              {language === 'fr' ? 'Français' : 'English'}
            </Badge>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={language === 'fr' ? "Sélectionnez la langue" : "Select language"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'fr' 
              ? "Choisissez la langue de l'interface utilisateur" 
              : "Choose the user interface language"}
          </p>
        </div>
      </div>
    </div>
  );
};
