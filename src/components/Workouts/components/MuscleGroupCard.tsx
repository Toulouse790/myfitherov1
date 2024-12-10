import { Card } from "@/components/ui/card";
import { Dumbbell, ChevronRight } from "lucide-react";

interface MuscleGroupCardProps {
  id: string;
  name: string;
  isSelected: boolean;
  exerciseCount: number;
  onClick: () => void;
}

export const MuscleGroupCard = ({
  id,
  name,
  isSelected,
  exerciseCount,
  onClick
}: MuscleGroupCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={`p-4 cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden
        ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm sm:text-base truncate">{name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {exerciseCount} exercices
          </p>
        </div>
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
      </div>
    </Card>
  );
};