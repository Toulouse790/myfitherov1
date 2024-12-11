import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StyleSettings } from "../types";

interface WorkoutsPreviewProps {
  styles: StyleSettings;
}

export const WorkoutsPreview = ({ styles }: WorkoutsPreviewProps) => {
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
};