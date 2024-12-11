import { StyleSettings } from "../types";
import { PreviewDashboardStats } from "./PreviewComponents/PreviewDashboardStats";
import { PreviewTrendMetrics } from "./PreviewComponents/PreviewTrendMetrics";
import { PreviewStrengthScore } from "./PreviewComponents/PreviewStrengthScore";

interface DashboardPreviewProps {
  styles: StyleSettings;
}

export const DashboardPreview = ({ styles }: DashboardPreviewProps) => {
  return (
    <div className="space-y-4">
      <h3 style={{ fontFamily: styles.heading_font }} className="text-2xl font-bold">
        Tableau de bord
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div
          className="p-4 rounded"
          style={{
            backgroundColor: styles.primary_color,
            borderRadius: styles.widget_radius,
            boxShadow: styles.widget_shadow,
          }}
        >
          <PreviewStrengthScore />
        </div>
        <div
          className="p-4 rounded"
          style={{
            backgroundColor: styles.secondary_color,
            borderRadius: styles.widget_radius,
            boxShadow: styles.widget_shadow,
          }}
        >
          <PreviewTrendMetrics />
        </div>
      </div>
      <div
        className="p-4 rounded"
        style={{
          backgroundColor: styles.primary_color,
          borderRadius: styles.widget_radius,
          boxShadow: styles.widget_shadow,
        }}
      >
        <PreviewDashboardStats />
      </div>
    </div>
  );
};