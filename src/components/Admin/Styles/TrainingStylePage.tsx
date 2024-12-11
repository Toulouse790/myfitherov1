import { useState } from "react";
import { Card } from "@/components/ui/card";
import { WidgetGrid } from "../Dashboard/WidgetGrid";
import { useAvailableWidgets } from "@/hooks/admin/use-available-widgets";
import { useWidgetConfigs } from "@/hooks/admin/use-widget-configs";
import { AddWidgetSheet } from "../Dashboard/AddWidgetSheet";
import { Button } from "@/components/ui/button";

export const TrainingStylePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: availableWidgets } = useAvailableWidgets();
  const { widgetConfigs, updateConfig, deleteConfig } = useWidgetConfigs();

  const handleDragEnd = (event: any) => {
    if (!isEditing || !widgetConfigs) return;
    
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = widgetConfigs.findIndex((w) => w.id === active.id);
      const newIndex = widgetConfigs.findIndex((w) => w.id === over.id);
      
      const newConfigs = [...widgetConfigs];
      const [removed] = newConfigs.splice(oldIndex, 1);
      newConfigs.splice(newIndex, 0, removed);
      
      newConfigs.forEach((config, index) => {
        updateConfig.mutate({ ...config, position: index });
      });
    }
  };

  const handleToggleWidget = (widget: any) => {
    // Logique à implémenter si nécessaire
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Style d'entraînement</h2>
        <div className="flex gap-2">
          <AddWidgetSheet
            availableWidgets={availableWidgets}
            widgetConfigs={widgetConfigs}
            onToggleWidget={handleToggleWidget}
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Terminer" : "Réorganiser"}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <WidgetGrid
          isEditing={isEditing}
          widgetConfigs={widgetConfigs}
          onDragEnd={handleDragEnd}
          onUpdateConfig={(data) => updateConfig.mutate(data)}
          onDeleteConfig={(id) => deleteConfig.mutate(id)}
        />
      </Card>
    </div>
  );
};