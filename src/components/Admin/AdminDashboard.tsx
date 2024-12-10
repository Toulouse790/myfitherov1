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
import { GripHorizontal } from "lucide-react";
import { useAdminStats } from "@/hooks/admin/use-admin-stats";
import { UsersWidget } from "./Dashboard/UsersWidget";
import { WorkoutsWidget } from "./Dashboard/WorkoutsWidget";
import { ExercisesWidget } from "./Dashboard/ExercisesWidget";

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
  const [widgets, setWidgets] = useState([
    { id: "users", label: "Nouveaux utilisateurs" },
    { id: "workouts", label: "Séances d'entraînement" },
    { id: "exercises", label: "Exercices publiés" }
  ]);

  const { monthlyUsers, monthlyWorkouts, publishedExercises } = useAdminStats();

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
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const renderWidget = (widget: typeof widgets[0]) => {
    switch (widget.id) {
      case "users":
        return <UsersWidget data={monthlyUsers} />;
      case "workouts":
        return <WorkoutsWidget data={monthlyWorkouts} />;
      case "exercises":
        return <ExercisesWidget data={publishedExercises} />;
      default:
        return null;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
          {widgets.map((widget) => (
            <SortableCard key={widget.id} id={widget.id} isEditing={isEditing}>
              {renderWidget(widget)}
            </SortableCard>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};