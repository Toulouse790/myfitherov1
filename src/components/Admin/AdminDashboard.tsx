import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";
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
  const [widgets, setWidgets] = useState([
    {
      id: "revenue",
      data: [
        { month: "Jan", revenue: 2400 },
        { month: "Fév", revenue: 1398 },
        { month: "Mar", revenue: 9800 },
        { month: "Avr", revenue: 3908 },
        { month: "Mai", revenue: 4800 },
        { month: "Jun", revenue: 3800 },
      ],
    },
    {
      id: "users",
      data: [
        { day: "Lun", users: 500 },
        { day: "Mar", users: 300 },
        { day: "Mer", users: 600 },
        { day: "Jeu", users: 400 },
        { day: "Ven", users: 700 },
        { day: "Sam", users: 200 },
        { day: "Dim", users: 300 },
      ],
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);

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
    if (widget.id === "revenue") {
      return (
        <Card className="p-6 relative">
          <h3 className="font-semibold mb-4">Revenus mensuels</h3>
          <BarChart
            data={widget.data}
            index="month"
            categories={["revenue"]}
            colors={["#8B5CF6"]}
            valueFormatter={(value: number) => `${value}€`}
          />
        </Card>
      );
    }
    return (
      <Card className="p-6 relative">
        <h3 className="font-semibold mb-4">Activité utilisateurs</h3>
        <BarChart
          data={widget.data}
          index="day"
          categories={["users"]}
          colors={["#10B981"]}
          valueFormatter={(value: number) => `${value} utilisateurs`}
        />
      </Card>
    );
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