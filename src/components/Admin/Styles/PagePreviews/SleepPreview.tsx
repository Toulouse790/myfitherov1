import { Card } from "@/components/ui/card";
import { StyleSettings } from "../types";

interface SleepPreviewProps {
  styles: StyleSettings;
}

export const SleepPreview = ({ styles }: SleepPreviewProps) => {
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
};