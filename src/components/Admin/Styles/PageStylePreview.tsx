import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { StyleSettings } from "./types";

interface PageStylePreviewProps {
  styles: StyleSettings;
  pageName: string;
}

export const PageStylePreview = ({ styles, pageName }: PageStylePreviewProps) => {
  const getPageSpecificContent = () => {
    switch (pageName) {
      case "workouts":
        return (
          <div className="space-y-4">
            <h3 style={{ fontFamily: styles.heading_font }} className="text-xl font-bold">
              Mes entraînements
            </h3>
            <div className="grid gap-4">
              <div
                className="p-4"
                style={{
                  backgroundColor: styles.primary_color,
                  borderRadius: styles.widget_radius,
                  boxShadow: styles.widget_shadow,
                }}
              >
                <p className="text-white" style={{ fontFamily: styles.primary_font }}>
                  Prochain entraînement
                </p>
              </div>
            </div>
          </div>
        );
      case "nutrition":
        return (
          <div className="space-y-4">
            <h3 style={{ fontFamily: styles.heading_font }} className="text-xl font-bold">
              Mon suivi nutritionnel
            </h3>
            <div
              className="p-4"
              style={{
                backgroundColor: styles.secondary_color,
                borderRadius: styles.widget_radius,
                boxShadow: styles.widget_shadow,
              }}
            >
              <p className="text-white" style={{ fontFamily: styles.primary_font }}>
                Objectifs journaliers
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h3 style={{ fontFamily: styles.heading_font }} className="text-xl font-bold">
              Aperçu de {pageName}
            </h3>
            <div
              className="p-4"
              style={{
                backgroundColor: styles.primary_color,
                borderRadius: styles.widget_radius,
                boxShadow: styles.widget_shadow,
              }}
            >
              <p className="text-white" style={{ fontFamily: styles.primary_font }}>
                Contenu exemple
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Aperçu de la page {pageName}
        </CardTitle>
      </CardHeader>
      <CardContent>{getPageSpecificContent()}</CardContent>
    </Card>
  );
};