import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontSection } from "./FontSection";
import { ColorSection } from "./ColorSection";
import { ButtonSection } from "./ButtonSection";
import { WidgetSection } from "./WidgetSection";
import { PageStylePreview } from "./PageStylePreview";
import { PageSelector } from "./PageSelector";
import { TrainingStylePage } from "./TrainingStylePage";
import type { StyleSettings } from "./types";

export const StylesManager = () => {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState("home");
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

  const handleStyleUpdate = (updates: Partial<StyleSettings>) => {
    setStyles(prev => ({ ...prev, ...updates }));
  };

  const saveStyles = async () => {
    try {
      const { error } = await supabase
        .from('admin_page_styles')
        .upsert({
          ...styles,
          page_name: selectedPage,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Styles mis à jour",
        description: `Les modifications pour la page ${selectedPage} ont été enregistrées.`,
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
      <PageSelector selectedPage={selectedPage} onPageChange={setSelectedPage} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Tabs defaultValue="fonts" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="fonts">Polices</TabsTrigger>
              <TabsTrigger value="colors">Couleurs</TabsTrigger>
              <TabsTrigger value="buttons">Boutons</TabsTrigger>
              <TabsTrigger value="widgets">Widgets</TabsTrigger>
              <TabsTrigger value="training">Entraînement</TabsTrigger>
            </TabsList>

            <TabsContent value="fonts">
              <FontSection styles={styles} onStyleChange={handleStyleChange} />
            </TabsContent>

            <TabsContent value="colors">
              <ColorSection styles={styles} onStyleChange={handleStyleChange} />
            </TabsContent>

            <TabsContent value="buttons">
              <ButtonSection 
                styles={styles} 
                onStyleChange={handleStyleChange}
                onStyleUpdate={handleStyleUpdate}
              />
            </TabsContent>

            <TabsContent value="widgets">
              <WidgetSection styles={styles} onStyleChange={handleStyleChange} />
            </TabsContent>

            <TabsContent value="training">
              <TrainingStylePage />
            </TabsContent>
          </Tabs>

          <Button onClick={saveStyles} className="w-full">
            Sauvegarder les modifications
          </Button>
        </div>

        <div className="sticky top-6">
          <PageStylePreview styles={styles} pageName={selectedPage} />
        </div>
      </div>
    </div>
  );
};