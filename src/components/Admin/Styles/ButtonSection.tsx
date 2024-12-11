import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Square } from "lucide-react";
import { StyleSettings } from "./types";

interface ButtonSectionProps {
  styles: StyleSettings;
  onStyleChange: (field: keyof StyleSettings) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ButtonSection = ({ styles, onStyleChange }: ButtonSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Square className="h-5 w-5" />
          Style des boutons
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Rayon des coins</label>
          <Input
            value={styles.button_radius}
            onChange={onStyleChange('button_radius')}
            placeholder="ex: 0.5rem"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Ombre</label>
          <Input
            value={styles.button_shadow}
            onChange={onStyleChange('button_shadow')}
            placeholder="ex: 0 2px 4px rgba(0, 0, 0, 0.1)"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Aperçu</h3>
          <div className="flex gap-2">
            <Button
              style={{
                borderRadius: styles.button_radius,
                boxShadow: styles.button_shadow,
              }}
            >
              Bouton primaire
            </Button>
            <Button
              variant="secondary"
              style={{
                borderRadius: styles.button_radius,
                boxShadow: styles.button_shadow,
              }}
            >
              Bouton secondaire
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};