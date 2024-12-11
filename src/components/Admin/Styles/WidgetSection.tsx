import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";
import { StyleSettings } from "./types";

interface WidgetSectionProps {
  styles: StyleSettings;
  onStyleChange: (field: keyof StyleSettings) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WidgetSection = ({ styles, onStyleChange }: WidgetSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          Style des widgets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Rayon des coins</label>
          <Input
            value={styles.widget_radius}
            onChange={onStyleChange('widget_radius')}
            placeholder="ex: 1rem"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Ombre</label>
          <Input
            value={styles.widget_shadow}
            onChange={onStyleChange('widget_shadow')}
            placeholder="ex: 0 4px 6px rgba(0, 0, 0, 0.1)"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Aperçu</h3>
          <div
            className="p-4 bg-white"
            style={{
              borderRadius: styles.widget_radius,
              boxShadow: styles.widget_shadow,
            }}
          >
            <p>Exemple de widget</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};