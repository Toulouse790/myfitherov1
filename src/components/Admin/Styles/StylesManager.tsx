import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Palette, Type } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StyleSettings {
  primary_font: string;
  heading_font: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

export const StylesManager = () => {
  const { toast } = useToast();
  const [styles, setStyles] = useState<StyleSettings>({
    primary_font: "Roboto",
    heading_font: "Montserrat",
    primary_color: "#9b87f5",
    secondary_color: "#7E69AB",
    accent_color: "#F97316"
  });

  const handleStyleChange = (field: keyof StyleSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setStyles(prev => ({ ...prev, [field]: e.target.value }));
  };

  const saveStyles = async () => {
    try {
      const { error } = await supabase
        .from('app_styles')
        .upsert({
          ...styles,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Styles mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des styles.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Polices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Police principale</label>
            <Input
              value={styles.primary_font}
              onChange={handleStyleChange('primary_font')}
              placeholder="ex: Roboto"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Police des titres</label>
            <Input
              value={styles.heading_font}
              onChange={handleStyleChange('heading_font')}
              placeholder="ex: Montserrat"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Couleurs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Couleur primaire</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={styles.primary_color}
                onChange={handleStyleChange('primary_color')}
                className="w-20"
              />
              <Input
                value={styles.primary_color}
                onChange={handleStyleChange('primary_color')}
                placeholder="ex: #9b87f5"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Couleur secondaire</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={styles.secondary_color}
                onChange={handleStyleChange('secondary_color')}
                className="w-20"
              />
              <Input
                value={styles.secondary_color}
                onChange={handleStyleChange('secondary_color')}
                placeholder="ex: #7E69AB"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Couleur d'accent</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={styles.accent_color}
                onChange={handleStyleChange('accent_color')}
                className="w-20"
              />
              <Input
                value={styles.accent_color}
                onChange={handleStyleChange('accent_color')}
                placeholder="ex: #F97316"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveStyles} className="w-full">
        Sauvegarder les modifications
      </Button>
    </div>
  );
};