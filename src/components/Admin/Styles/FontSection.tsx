import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Type } from "lucide-react";
import { StyleSettings } from "./types";

interface FontSectionProps {
  styles: StyleSettings;
  onStyleChange: (field: keyof StyleSettings) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FontSection = ({ styles, onStyleChange }: FontSectionProps) => {
  return (
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
            onChange={onStyleChange('primary_font')}
            placeholder="ex: Roboto"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Police des titres</label>
          <Input
            value={styles.heading_font}
            onChange={onStyleChange('heading_font')}
            placeholder="ex: Montserrat"
          />
        </div>
      </CardContent>
    </Card>
  );
};