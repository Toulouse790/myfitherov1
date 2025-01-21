import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableCard } from "./SortableCard";
import { WidgetWrapper } from "./WidgetComponents/WidgetWrapper";
import { WidgetRenderer } from "./WidgetComponents/WidgetRenderer";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { useCallback } from "react";

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
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getWidgetData = (widgetId: string) => {
    switch (widgetId) {
      case 'users':
        return monthlyUsers;
      case 'workouts':
        return monthlyWorkouts;
      case 'exercises':
        return publishedExercises;
      default:
        return [];
    }
  };

  const handleResize = useCallback((entry: ResizeObserverEntry) => {
    // Handle resize if needed
    console.log('Widget resized:', entry.contentRect);
  }, []);

  const setResizeRef = useResizeObserver(handleResize);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <div className="grid gap-6 md:grid-cols-2 mt-6" ref={setResizeRef}>
        <SortableContext 
          items={widgetConfigs?.map(w => w.id) || []} 
          strategy={verticalListSortingStrategy}
        >
          {widgetConfigs?.map((config) => (
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