import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { StyleSettings } from "./types";
import { WorkoutsPreview } from "./PagePreviews/WorkoutsPreview";
import { NutritionPreview } from "./PagePreviews/NutritionPreview";
import { StatsPreview } from "./PagePreviews/StatsPreview";
import { SleepPreview } from "./PagePreviews/SleepPreview";
import { DashboardPreview } from "./PagePreviews/DashboardPreview";

interface PageStylePreviewProps {
  styles: StyleSettings;
  pageName: string;
}

export const PageStylePreview = ({ styles, pageName }: PageStylePreviewProps) => {
  const getPageSpecificContent = () => {
    switch (pageName) {
      case "home":
        return <DashboardPreview styles={styles} />;
      case "workouts":
        return <WorkoutsPreview styles={styles} />;
      case "nutrition":
        return <NutritionPreview styles={styles} />;
      case "stats":
        return <StatsPreview styles={styles} />;
      case "sleep":
        return <SleepPreview styles={styles} />;
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