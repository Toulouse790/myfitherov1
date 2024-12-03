import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Languages, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";

interface AppSettingsProps {
  language: string;
}

export const AppSettings = ({ language }: AppSettingsProps) => {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Paramètres de l'application</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <p className="font-medium">Mode sombre</p>
                <p className="text-sm text-muted-foreground">Changer l'apparence</p>
              </div>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5" />
              <div>
                <p className="font-medium">Langue</p>
                <p className="text-sm text-muted-foreground">{language}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};