import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StyleSettings } from "../types";

interface NutritionPreviewProps {
  styles: StyleSettings;
}

export const NutritionPreview = ({ styles }: NutritionPreviewProps) => {
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
};