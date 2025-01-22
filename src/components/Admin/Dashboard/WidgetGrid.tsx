import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableCard } from "./SortableCard";
import { WidgetWrapper } from "./WidgetComponents/WidgetWrapper";
import { WidgetRenderer } from "./WidgetComponents/WidgetRenderer";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface WidgetGridProps {
  isEditing: boolean;
  widgetConfigs: any[];
  monthlyUsers: any[];
  monthlyWorkouts: any[];
  publishedExercises: any[];
  onDragEnd: (event: any) => void;
  onUpdateConfig: (data: any) => void;
  onDeleteConfig: (id: string) => void;
}

export const WidgetGrid = ({
  isEditing,
  widgetConfigs,
  monthlyUsers,
  monthlyWorkouts,
  publishedExercises,
  onDragEnd,
  onUpdateConfig,
  onDeleteConfig,
}: WidgetGridProps) => {
  const { toast } = useToast();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getWidgetData = useCallback((widgetId: string) => {
    console.log("Getting data for widget:", widgetId);
    switch (widgetId) {
      case 'users':
        return monthlyUsers;
      case 'workouts':
        return monthlyWorkouts;
      case 'exercises':
        return publishedExercises;
      default:
        console.log("No data found for widget:", widgetId);
        return [];
    }
  }, [monthlyUsers, monthlyWorkouts, publishedExercises]);

  const handleResize = useCallback((entry: ResizeObserverEntry) => {
    console.log('Widget resized:', entry.contentRect);
  }, []);

  const setResizeRef = useResizeObserver(handleResize);

  const handleDragEnd = useCallback((event: any) => {
    console.log("Drag ended:", event);
    try {
      onDragEnd(event);
    } catch (error) {
      console.error("Error during drag end:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du déplacement du widget",
        variant: "destructive",
      });
    }
  }, [onDragEnd, toast]);

  if (!widgetConfigs?.length) {
    console.log("No widget configs found");
    return (
      <div className="p-4 text-center text-gray-500">
        Aucun widget configuré
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-6 md:grid-cols-2 mt-6" ref={setResizeRef}>
        <SortableContext 
          items={widgetConfigs.map(w => w.id)} 
          strategy={verticalListSortingStrategy}
        >
          {widgetConfigs.map((config) => (
            <SortableCard key={config.id} id={config.id} isEditing={isEditing}>
              <WidgetWrapper
                config={config}
                isEditing={isEditing}
                onUpdateConfig={onUpdateConfig}
                onDeleteConfig={onDeleteConfig}
              >
                <WidgetRenderer
                  config={config}
                  data={getWidgetData(config.widget_id)}
                  title={config.title}
                />
              </WidgetWrapper>
            </SortableCard>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};