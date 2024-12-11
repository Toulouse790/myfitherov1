import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableCard } from "./SortableCard";
import { WidgetSettings } from "./WidgetSettings";
import { UsersWidget } from "./UsersWidget";
import { WorkoutsWidget } from "./WorkoutsWidget";
import { ExercisesWidget } from "./ExercisesWidget";

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

  const renderWidget = (config: any) => {
    const WidgetComponent = {
      users: UsersWidget,
      workouts: WorkoutsWidget,
      exercises: ExercisesWidget,
    }[config.widget_id];

    if (!WidgetComponent) return null;

    return (
      <div className="relative">
        {!isEditing && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <WidgetSettings
              config={config}
              onUpdate={onUpdateConfig}
              onDelete={() => onDeleteConfig(config.id)}
            />
          </Dialog>
        )}
        <WidgetComponent
          data={
            config.widget_id === 'users' ? monthlyUsers :
            config.widget_id === 'workouts' ? monthlyWorkouts :
            config.widget_id === 'exercises' ? publishedExercises :
            null
          }
          title={config.title}
        />
      </div>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <SortableContext 
          items={widgetConfigs?.map(w => w.id) || []} 
          strategy={verticalListSortingStrategy}
        >
          {widgetConfigs?.map((config) => (
            <SortableCard key={config.id} id={config.id} isEditing={isEditing}>
              {renderWidget(config)}
            </SortableCard>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};