import { Card } from "@/components/ui/card";
import { StyleSettings } from "../types";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { StrengthScore } from "@/components/Dashboard/StrengthScore";

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
          <StrengthScore />
        </div>
        <div
          className="p-4 rounded"
          style={{
            backgroundColor: styles.secondary_color,
            borderRadius: styles.widget_radius,
            boxShadow: styles.widget_shadow,
          }}
        >
          <TrendMetrics />
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
        <DashboardStats />
      </div>
    </div>
  );
};