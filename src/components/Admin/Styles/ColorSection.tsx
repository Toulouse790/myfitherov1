import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { StyleSettings } from "./types";

interface ColorSectionProps {
  styles: StyleSettings;
  onStyleChange: (field: keyof StyleSettings) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ColorSection = ({ styles, onStyleChange }: ColorSectionProps) => {
  return (
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
              onChange={onStyleChange('primary_color')}
              className="w-20"
            />
            <Input
              value={styles.primary_color}
              onChange={onStyleChange('primary_color')}
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
              onChange={onStyleChange('secondary_color')}
              className="w-20"
            />
            <Input
              value={styles.secondary_color}
              onChange={onStyleChange('secondary_color')}
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
              onChange={onStyleChange('accent_color')}
              className="w-20"
            />
            <Input
              value={styles.accent_color}
              onChange={onStyleChange('accent_color')}
              placeholder="ex: #F97316"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};