import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { GripHorizontal, Plus } from "lucide-react";
import { useAdminStats } from "@/hooks/admin/use-admin-stats";
import { useAvailableWidgets } from "@/hooks/admin/use-available-widgets";
import { Button } from "@/components/ui/button";
import { UsersWidget } from "./Dashboard/UsersWidget";
import { WorkoutsWidget } from "./Dashboard/WorkoutsWidget";
import { ExercisesWidget } from "./Dashboard/ExercisesWidget";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SortableCard = ({ id, children, isEditing }: { id: string; children: React.ReactNode, isEditing: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isEditing ? 'grab' : 'default',
  };

  return (
    <div ref={setNodeRef} style={style} {...(isEditing ? { ...attributes, ...listeners } : {})}>
      {isEditing && (
        <div className="absolute top-2 right-2 z-10">
          <GripHorizontal className="w-5 h-5 text-gray-400" />
        </div>
      )}
      {children}
    </div>
  );
};

export const AdminDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState([
    { id: "users", label: "Nouveaux utilisateurs" },
    { id: "workouts", label: "Séances d'entraînement" },
    { id: "exercises", label: "Exercices publiés" }
  ]);

  const { monthlyUsers, monthlyWorkouts, publishedExercises } = useAdminStats();
  const { data: availableWidgets } = useAvailableWidgets();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    if (!isEditing) return;
    
    const { active, over } = event;

    if (active.id !== over.id) {
      setActiveWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleWidget = (widgetId: string) => {
    setActiveWidgets(current => {
      const isActive = current.some(w => w.id === widgetId);
      if (isActive) {
        return current.filter(w => w.id !== widgetId);
      } else {
        const widget = availableWidgets?.find(w => w.id === widgetId);
        if (widget) {
          return [...current, { id: widget.id, label: widget.name }];
        }
        return current;
      }
    });
  };

  const renderWidget = (widget: typeof activeWidgets[0]) => {
    switch (widget.id) {
      case "users":
        return <UsersWidget data={monthlyUsers} />;
      case "workouts":
        return <WorkoutsWidget data={monthlyWorkouts} />;
      case "exercises":
        return <ExercisesWidget data={publishedExercises} />;
      default:
        const availableWidget = availableWidgets?.find(w => w.id === widget.id);
        if (availableWidget) {
          return (
            <div className="p-6 bg-card text-card-foreground rounded-lg shadow">
              <h3 className="font-semibold mb-4">{availableWidget.name}</h3>
              <p className="text-sm text-muted-foreground">{availableWidget.description}</p>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Tableau de bord</h2>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un widget
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Widgets disponibles</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
                <div className="space-y-4">
                  {availableWidgets?.map((widget) => (
                    <div key={widget.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>{widget.name}</Label>
                        <p className="text-sm text-muted-foreground">{widget.description}</p>
                      </div>
                      <Switch
                        checked={activeWidgets.some(w => w.id === widget.id)}
                        onCheckedChange={() => toggleWidget(widget.id)}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Terminer" : "Réorganiser"}
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <SortableContext items={activeWidgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
            {activeWidgets.map((widget) => (
              <SortableCard key={widget.id} id={widget.id} isEditing={isEditing}>
                {renderWidget(widget)}
              </SortableCard>
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </>
  );
};