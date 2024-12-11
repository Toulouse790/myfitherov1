import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";

interface SortableCardProps {
  id: string;
  children: React.ReactNode;
  isEditing: boolean;
}

export const SortableCard = ({ id, children, isEditing }: SortableCardProps) => {
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