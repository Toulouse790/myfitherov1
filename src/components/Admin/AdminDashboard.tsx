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
import { GripHorizontal, Plus, Settings, X } from "lucide-react";
import { useAdminStats } from "@/hooks/admin/use-admin-stats";
import { useAvailableWidgets } from "@/hooks/admin/use-available-widgets";
import { useWidgetConfigs } from "@/hooks/admin/use-widget-configs";
import { Button } from "@/components/ui/button";
import { AdminStats } from "./AdminStats";
import { UsersWidget } from "./Dashboard/UsersWidget";
import { WorkoutsWidget } from "./Dashboard/WorkoutsWidget";
import { ExercisesWidget } from "./Dashboard/ExercisesWidget";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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

const WidgetSettings = ({ config, onUpdate, onDelete }: { 
  config: any; 
  onUpdate: (data: any) => void;
  onDelete: () => void;
}) => {
  const [title, setTitle] = useState(config.title);

  const handleSave = () => {
    onUpdate({ ...config, title });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Paramètres du widget</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Titre</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du widget"
          />
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleSave}>
            Sauvegarder
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Supprimer
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export const AdminDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { monthlyUsers, monthlyWorkouts, publishedExercises } = useAdminStats();
  const { data: availableWidgets } = useAvailableWidgets();
  const { widgetConfigs, updateConfig, deleteConfig } = useWidgetConfigs();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
              onUpdate={(data) => updateConfig.mutate(data)}
              onDelete={() => deleteConfig.mutate(config.id)}
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
                        checked={widgetConfigs?.some(w => w.widget_id === widget.id)}
                        onCheckedChange={() => {
                          // Logique d'ajout/suppression à implémenter
                        }}
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

      <AdminStats />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
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
    </>
  );
};