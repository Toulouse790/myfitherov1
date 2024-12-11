import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

interface StyleSettings {
  primary_font: string;
  heading_font: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  button_radius: string;
  button_shadow: string;
  widget_radius: string;
  widget_shadow: string;
}

export const StylesManager = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [styles, setStyles] = useState<StyleSettings>({
    primary_font: "Roboto",
    heading_font: "Montserrat",
    primary_color: "#9b87f5",
    secondary_color: "#7E69AB",
    accent_color: "#F97316",
    button_radius: "0.5rem",
    button_shadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    widget_radius: "1rem",
    widget_shadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
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
          user_id: user?.id
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
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Tabs defaultValue="fonts" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="fonts">Polices</TabsTrigger>
              <TabsTrigger value="colors">Couleurs</TabsTrigger>
              <TabsTrigger value="buttons">Boutons</TabsTrigger>
              <TabsTrigger value="widgets">Widgets</TabsTrigger>
            </TabsList>

            <TabsContent value="fonts" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Police principale</Label>
                    <Input
                      type="text"
                      value={styles.primary_font}
                      onChange={handleStyleChange('primary_font')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Police des titres</Label>
                    <Input
                      type="text"
                      value={styles.heading_font}
                      onChange={handleStyleChange('heading_font')}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Couleur principale</Label>
                    <Input
                      type="color"
                      value={styles.primary_color}
                      onChange={handleStyleChange('primary_color')}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Couleur secondaire</Label>
                    <Input
                      type="color"
                      value={styles.secondary_color}
                      onChange={handleStyleChange('secondary_color')}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Couleur d'accent</Label>
                    <Input
                      type="color"
                      value={styles.accent_color}
                      onChange={handleStyleChange('accent_color')}
                      className="h-10"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="buttons" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Rayon des boutons</Label>
                    <Input
                      type="text"
                      value={styles.button_radius}
                      onChange={handleStyleChange('button_radius')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ombre des boutons</Label>
                    <Input
                      type="text"
                      value={styles.button_shadow}
                      onChange={handleStyleChange('button_shadow')}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="widgets" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Rayon des widgets</Label>
                    <Input
                      type="text"
                      value={styles.widget_radius}
                      onChange={handleStyleChange('widget_radius')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ombre des widgets</Label>
                    <Input
                      type="text"
                      value={styles.widget_shadow}
                      onChange={handleStyleChange('widget_shadow')}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <Button onClick={saveStyles} className="w-full">
            Sauvegarder les modifications
          </Button>
        </div>

        <div className="sticky top-6">
          <Card className="p-6">
            <h2 className="text-2xl font-heading mb-4" style={{ fontFamily: styles.heading_font }}>
              Aperçu des modifications
            </h2>
            <div className="space-y-4">
              <p style={{ fontFamily: styles.primary_font }}>
                Texte avec la police principale
              </p>
              <div className="space-y-2">
                <Button
                  style={{
                    backgroundColor: styles.primary_color,
                    borderRadius: styles.button_radius,
                    boxShadow: styles.button_shadow
                  }}
                >
                  Bouton principal
                </Button>
                <Button
                  variant="secondary"
                  style={{
                    backgroundColor: styles.secondary_color,
                    borderRadius: styles.button_radius,
                    boxShadow: styles.button_shadow
                  }}
                >
                  Bouton secondaire
                </Button>
              </div>
              <div
                className="p-4 bg-white"
                style={{
                  borderRadius: styles.widget_radius,
                  boxShadow: styles.widget_shadow
                }}
              >
                <p className="text-sm">Exemple de widget</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};