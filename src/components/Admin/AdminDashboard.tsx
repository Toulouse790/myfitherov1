import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useAdminStats } from "@/hooks/admin/use-admin-stats";
import { useAvailableWidgets } from "@/hooks/admin/use-available-widgets";
import { useWidgetConfigs } from "@/hooks/admin/use-widget-configs";
import { Button } from "@/components/ui/button";
import { AdminStats } from "./AdminStats";
import { AddWidgetSheet } from "./Dashboard/AddWidgetSheet";
import { WidgetGrid } from "./Dashboard/WidgetGrid";

export const AdminDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { monthlyUsers, monthlyWorkouts, publishedExercises } = useAdminStats();
  const { data: availableWidgets } = useAvailableWidgets();
  const { widgetConfigs, updateConfig, deleteConfig } = useWidgetConfigs();

  const handleDragEnd = (event: any) => {
    if (!isEditing || !widgetConfigs) return;
    
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = widgetConfigs.findIndex((w) => w.id === active.id);
      const newIndex = widgetConfigs.findIndex((w) => w.id === over.id);
      
      const newConfigs = arrayMove(widgetConfigs, oldIndex, newIndex);
      newConfigs.forEach((config, index) => {
        updateConfig.mutate({ ...config, position: index });
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Tableau de bord</h2>
        <div className="flex gap-2">
          <AddWidgetSheet availableWidgets={availableWidgets} />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Terminer" : "Réorganiser"}
          </Button>
        </div>
      </div>

      <AdminStats />

      <WidgetGrid
        isEditing={isEditing}
        widgetConfigs={widgetConfigs}
        monthlyUsers={monthlyUsers}
        monthlyWorkouts={monthlyWorkouts}
        publishedExercises={publishedExercises}
        onDragEnd={handleDragEnd}
        onUpdateConfig={(data) => updateConfig.mutate(data)}
        onDeleteConfig={(id) => deleteConfig.mutate(id)}
      />
    </>
  );
};