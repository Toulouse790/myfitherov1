import { ThemeSelector } from "@/components/Theme/ThemeSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AppSettingsProps {
  language: string;
}

export const AppSettings = ({ language }: AppSettingsProps) => {
  const { toast } = useToast();

  const handleLanguageChange = (value: string) => {
    toast({
      title: "Langue mise à jour",
      description: "La langue a été changée avec succès",
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Paramètres de l'application</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Thème</label>
          <ThemeSelector />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Langue</label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez la langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};