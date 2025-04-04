import { Button } from "@/components/ui/button";
import { Play, CheckCircle } from "lucide-react";

interface ExerciseHeaderProps {
  name: string;
  isActive: boolean;
  onStart: () => void;
}

export const ExerciseHeader = ({ name, isActive, onStart }: ExerciseHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <h3 className="text-sm sm:text-base font-medium line-clamp-2">{name}</h3>
      <Button
        variant={isActive ? "default" : "outline"}
        size="sm"
        className="flex-shrink-0 transition-all duration-300"
        onClick={onStart}
      >
        {isActive ? (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs sm:text-sm">En cours</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Commencer</span>
          </div>
        )}
      </Button>
    </div>
  );
};