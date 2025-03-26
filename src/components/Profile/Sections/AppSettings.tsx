
import { ThemeSelector } from "@/components/Theme/ThemeSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface AppSettingsProps {
  language: string;
}

export const AppSettings = ({ language: initialLanguage }: AppSettingsProps) => {
  const { toast } = useToast();
  const [language, setLanguage] = useState(initialLanguage);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast({
      title: "Langue mise à jour",
      description: `La langue a été changée en ${value === 'fr' ? 'Français' : 'English'}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-xl font-semibold">Paramètres de l'application</h2>
        <p className="text-sm text-muted-foreground">
          Configurez l'apparence et la langue de l'application
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Thème</label>
            <Badge variant="outline" className="text-xs font-normal">
              Personnaliser l'apparence
            </Badge>
          </div>
          <ThemeSelector />
          <p className="text-xs text-muted-foreground mt-1">
            Changez entre le mode clair, sombre ou utilisez les paramètres système
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Langue</label>
            <Badge variant="outline" className="text-xs font-normal">
              {language === 'fr' ? 'Français' : 'English'}
            </Badge>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez la langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Choisissez la langue de l'interface utilisateur
          </p>
        </div>
      </div>
    </div>
  );
};
