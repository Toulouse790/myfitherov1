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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

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
    { id: "workouts", label: "Séances d'entraînement" }
  ]);

  const { data: monthlyUsers } = useQuery({
    queryKey: ['admin-monthly-users'],
    queryFn: async () => {
      const startDate = startOfMonth(new Date());
      const endDate = endOfMonth(new Date());
      const days = eachDayOfInterval({ start: startDate, end: endDate });

      const { data: signups } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      const usersByDay = days.map(day => {
        const dayUsers = signups?.filter(signup => 
          format(parseISO(signup.created_at), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        ).length || 0;

        return {
          day: format(day, 'EEE', { locale: fr }),
          users: dayUsers
        };
      });

      return usersByDay;
    }
  });

  const { data: monthlyWorkouts } = useQuery({
    queryKey: ['admin-monthly-workouts'],
    queryFn: async () => {
      const startDate = startOfMonth(new Date());
      const endDate = endOfMonth(new Date());
      const days = eachDayOfInterval({ start: startDate, end: endDate });

      const { data: workouts } = await supabase
        .from('workout_sessions')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      const workoutsByDay = days.map(day => {
        const dayWorkouts = workouts?.filter(workout => 
          format(parseISO(workout.created_at), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        ).length || 0;

        return {
          day: format(day, 'EEE', { locale: fr }),
          workouts: dayWorkouts
        };
      });

      return workoutsByDay;
    }
  });

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
    if (widget.id === "users") {
      return (
        <Card className="p-6 relative">
          <h3 className="font-semibold mb-4">{widget.label}</h3>
          {monthlyUsers && (
            <BarChart
              data={monthlyUsers}
              index="day"
              categories={["users"]}
              colors={["#8B5CF6"]}
              valueFormatter={(value: number) => `${value} utilisateurs`}
            />
          )}
        </Card>
      );
    }
    return (
      <Card className="p-6 relative">
        <h3 className="font-semibold mb-4">{widget.label}</h3>
        {monthlyWorkouts && (
          <BarChart
            data={monthlyWorkouts}
            index="day"
            categories={["workouts"]}
            colors={["#10B981"]}
            valueFormatter={(value: number) => `${value} séances`}
          />
        )}
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