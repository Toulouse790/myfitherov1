import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { StyleSettings } from "./types";
import { LucideIcon } from "lucide-react";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bibliothèque de boutons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {buttons?.map((button) => {
            // Get the icon component from lucide-react with proper typing
            const IconComponent = button.icon_name ? (Icons[button.icon_name as keyof typeof Icons] as LucideIcon) : undefined;
            
            return (
              <Button
                key={button.id}
                onClick={() => handleSelectButton(button)}
                className="flex items-center gap-2 w-full justify-center"
                style={{
                  backgroundColor: button.style.backgroundColor,
                  color: button.style.color,
                  borderRadius: button.style.borderRadius,
                  boxShadow: button.style.boxShadow,
                  border: button.style.border,
                }}
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {button.name}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};