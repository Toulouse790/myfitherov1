import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { StyleSettings } from "./types";

interface StylePreviewProps {
  styles: StyleSettings;
}

export const StylePreview = ({ styles }: StylePreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Aperçu des modifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aperçu des polices */}
        <div>
          <h3 
            style={{ fontFamily: styles.heading_font }}
            className="text-2xl font-bold mb-2"
          >
            Titre d'exemple
          </h3>
          <p 
            style={{ fontFamily: styles.primary_font }}
            className="text-base"
          >
            Voici un exemple de texte utilisant la police principale. Il montre comment le contenu apparaîtra sur votre site.
          </p>
        </div>

        {/* Aperçu des couleurs */}
        <div className="grid gap-4">
          <div 
            style={{ backgroundColor: styles.primary_color }}
            className="h-12 rounded flex items-center justify-center text-white"
          >
            Couleur primaire
          </div>
          <div 
            style={{ backgroundColor: styles.secondary_color }}
            className="h-12 rounded flex items-center justify-center text-white"
          >
            Couleur secondaire
          </div>
          <div 
            style={{ backgroundColor: styles.accent_color }}
            className="h-12 rounded flex items-center justify-center text-white"
          >
            Couleur d'accent
          </div>
        </div>

        {/* Aperçu des boutons */}
        <div className="space-y-4">
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

        {/* Aperçu des widgets */}
        <div className="grid gap-4 md:grid-cols-2">
          <div
            className="p-4 bg-white"
            style={{
              borderRadius: styles.widget_radius,
              boxShadow: styles.widget_shadow,
            }}
          >
            <h4 className="font-semibold mb-2">Widget d'exemple 1</h4>
            <p className="text-sm text-gray-600">
              Contenu du widget avec les nouveaux styles
            </p>
          </div>
          <div
            className="p-4 bg-white"
            style={{
              borderRadius: styles.widget_radius,
              boxShadow: styles.widget_shadow,
            }}
          >
            <h4 className="font-semibold mb-2">Widget d'exemple 2</h4>
            <p className="text-sm text-gray-600">
              Un autre exemple de widget
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};