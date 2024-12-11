import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { StyleSettings } from "./types";
import { LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ButtonLibraryProps {
  onSelectStyle: (style: Partial<StyleSettings>) => void;
}

interface AvailableButton {
  id: string;
  name: string;
  style: {
    backgroundColor: string;
    color: string;
    borderRadius: string;
    boxShadow?: string;
    border?: string;
    background?: string;
  };
  icon_name: string;
  category: string;
}

export const ButtonLibrary = ({ onSelectStyle }: ButtonLibraryProps) => {
  const { data: buttons, isLoading } = useQuery({
    queryKey: ["available-buttons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("available_buttons")
        .select("*");
      
      if (error) throw error;
      return data as AvailableButton[];
    },
  });

  const handleSelectButton = (button: AvailableButton) => {
    onSelectStyle({
      button_radius: button.style.borderRadius,
      button_shadow: button.style.boxShadow || "",
      primary_color: button.style.backgroundColor,
    });
  };

  if (isLoading) {
    return <div>Chargement des boutons...</div>;
  }

  // Grouper les boutons par catégorie
  const groupedButtons = buttons?.reduce((acc, button) => {
    const category = button.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(button);
    return acc;
  }, {} as Record<string, AvailableButton[]>);

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'primary':
        return 'Boutons Principaux';
      case 'secondary':
        return 'Boutons Secondaires';
      default:
        return 'Autres Boutons';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bibliothèque de boutons</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {groupedButtons && Object.entries(groupedButtons).map(([category, categoryButtons]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {getCategoryTitle(category)}
              </h3>
              <Separator className="flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {categoryButtons.map((button) => {
                const IconComponent = button.icon_name ? (Icons[button.icon_name as keyof typeof Icons] as LucideIcon) : undefined;
                
                return (
                  <Button
                    key={button.id}
                    onClick={() => handleSelectButton(button)}
                    className="flex items-center gap-2 w-full justify-center h-12 relative group hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: button.style.backgroundColor,
                      color: button.style.color,
                      borderRadius: button.style.borderRadius,
                      boxShadow: button.style.boxShadow,
                      border: button.style.border,
                      background: button.style.background,
                    }}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    <span>{button.name}</span>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-[inherit] transition-opacity" />
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};