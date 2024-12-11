import { Card } from "@/components/ui/card";
import { StyleSettings } from "../types";

interface StatsPreviewProps {
  styles: StyleSettings;
}

export const StatsPreview = ({ styles }: StatsPreviewProps) => {
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
};