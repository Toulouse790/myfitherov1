import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { StyleSettings } from "./types";

interface StylePreviewProps {
  styles: StyleSettings;
  pageName: string;
}

export const StylePreview = ({ styles, pageName }: StylePreviewProps) => {
  const getPageSpecificContent = () => {
    switch (pageName) {
      case "workouts":
        return (
          <div className="space-y-4">
            <h3 style={{ fontFamily: styles.heading_font }} className="text-2xl font-bold">
              Mes entraînements
            </h3>
            <div className="grid gap-4">
              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: styles.primary_color,
                  borderRadius: styles.widget_radius,
                  boxShadow: styles.widget_shadow,
                }}
              >
                <p className="text-white" style={{ fontFamily: styles.primary_font }}>
                  Prochain entraînement
                </p>
                <Button
                  style={{
                    borderRadius: styles.button_radius,
                    boxShadow: styles.button_shadow,
                    backgroundColor: styles.accent_color,
                  }}
                  className="mt-2"
                >
                  Commencer
                </Button>
              </div>
              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: styles.secondary_color,
                  borderRadius: styles.widget_radius,
                  boxShadow: styles.widget_shadow,
                }}
              >
                <p className="text-white" style={{ fontFamily: styles.primary_font }}>
                  Historique des séances
                </p>
              </div>
            </div>
          </div>
        );
      case "nutrition":
        return (
          <div className="space-y-4">
            <h3 style={{ fontFamily: styles.heading_font }} className="text-2xl font-bold">
              Mon suivi nutritionnel
            </h3>
            <div
              className="p-4 rounded"
              style={{
                backgroundColor: styles.primary_color,
                borderRadius: styles.widget_radius,
                boxShadow: styles.widget_shadow,
              }}
            >
              <p className="text-white" style={{ fontFamily: styles.primary_font }}>
                Objectifs journaliers
              </p>
              <div className="mt-2 space-y-2">
                <div className="bg-white/20 p-2 rounded">
                  <p className="text-white text-sm">Calories: 2000 kcal</p>
                </div>
                <div className="bg-white/20 p-2 rounded">
                  <p className="text-white text-sm">Protéines: 150g</p>
                </div>
              </div>
            </div>
            <div
              className="p-4 rounded"
              style={{
                backgroundColor: styles.secondary_color,
                borderRadius: styles.widget_radius,
                boxShadow: styles.widget_shadow,
              }}
            >
              <p className="text-white" style={{ fontFamily: styles.primary_font }}>
                Journal alimentaire
              </p>
              <Button
                style={{
                  borderRadius: styles.button_radius,
                  boxShadow: styles.button_shadow,
                  backgroundColor: styles.accent_color,
                }}
                className="mt-2"
              >
                Ajouter un repas
              </Button>
            </div>
          </div>
        );
      case "stats":
        return (
          <div className="space-y-4">
            <h3 style={{ fontFamily: styles.heading_font }} className="text-2xl font-bold">
              Mes statistiques
            </h3>
            <div className="grid gap-4">
              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: styles.primary_color,
                  borderRadius: styles.widget_radius,
                  boxShadow: styles.widget_shadow,
                }}
              >
                <p className="text-white" style={{ fontFamily: styles.primary_font }}>
                  Progression mensuelle
                </p>
              </div>
              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: styles.secondary_color,
                  borderRadius: styles.widget_radius,
                  boxShadow: styles.widget_shadow,
                }}
              >
                <p className="text-white" style={{ fontFamily: styles.primary_font }}>
                  Records personnels
                </p>
              </div>
            </div>
          </div>
        );
      case "sleep":
        return (
          <div className="space-y-4">
            <h3 style={{ fontFamily: styles.heading_font }} className="text-2xl font-bold">
              Mon sommeil
            </h3>
            <div
              className="p-4 rounded"
              style={{
                backgroundColor: styles.primary_color,
                borderRadius: styles.widget_radius,
                boxShadow: styles.widget_shadow,
              }}
            >
              <p className="text-white" style={{ fontFamily: styles.primary_font }}>
                Qualité du sommeil
              </p>
              <div className="mt-2 bg-white/20 p-2 rounded">
                <p className="text-white text-sm">8h de sommeil</p>
              </div>
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
              className="p-4 rounded"
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Aperçu de la page {pageName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-lg min-h-[400px] bg-gray-50">
          {getPageSpecificContent()}
        </div>
      </CardContent>
    </Card>
  );
};