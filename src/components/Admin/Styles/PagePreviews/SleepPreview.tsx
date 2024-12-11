import { Card } from "@/components/ui/card";
import { StyleSettings } from "../types";

interface SleepPreviewProps {
  styles: StyleSettings;
  widgets?: any[];
}

export const SleepPreview = ({ styles, widgets }: SleepPreviewProps) => {
  return (
    <div className="space-y-4">
      <h3 style={{ fontFamily: styles.heading_font }} className="text-2xl font-bold">
        Mon sommeil
      </h3>
      <div className="grid gap-4">
        {widgets?.map((widget) => (
          <div
            key={widget.id}
            className="p-4 rounded"
            style={{
              backgroundColor: styles.primary_color,
              borderRadius: styles.widget_radius,
              boxShadow: styles.widget_shadow,
            }}
          >
            <p className="text-white" style={{ fontFamily: styles.primary_font }}>
              {widget.name}
            </p>
            <p className="text-white/80 text-sm mt-1">
              {widget.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};