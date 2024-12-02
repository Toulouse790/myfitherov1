import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState } from "react";

interface ColorScheme {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
}

export const ColorCustomization = () => {
  const { toast } = useToast();
  const [colors, setColors] = useState<ColorScheme>({
    background: "#FFFFFF",
    foreground: "#000000",
    primary: "#8B5CF6",
    secondary: "#D946EF",
    accent: "#F97316",
  });

  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Mettre à jour les variables CSS
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('theme-colors', JSON.stringify(colors));
    
    toast({
      title: "Couleurs sauvegardées",
      description: "Vos préférences de couleurs ont été enregistrées avec succès.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personnalisation des couleurs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="background">Couleur de fond</Label>
            <Input
              id="background"
              type="color"
              value={colors.background}
              onChange={(e) => handleColorChange("background", e.target.value)}
              className="h-10 w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="foreground">Couleur du texte</Label>
            <Input
              id="foreground"
              type="color"
              value={colors.foreground}
              onChange={(e) => handleColorChange("foreground", e.target.value)}
              className="h-10 w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primary">Couleur principale</Label>
            <Input
              id="primary"
              type="color"
              value={colors.primary}
              onChange={(e) => handleColorChange("primary", e.target.value)}
              className="h-10 w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondary">Couleur secondaire</Label>
            <Input
              id="secondary"
              type="color"
              value={colors.secondary}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
              className="h-10 w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accent">Couleur d'accent</Label>
            <Input
              id="accent"
              type="color"
              value={colors.accent}
              onChange={(e) => handleColorChange("accent", e.target.value)}
              className="h-10 w-full"
            />
          </div>
        </div>
        <Button onClick={handleSave} className="w-full mt-4">
          <Save className="mr-2" />
          Enregistrer les couleurs
        </Button>
      </CardContent>
    </Card>
  );
};