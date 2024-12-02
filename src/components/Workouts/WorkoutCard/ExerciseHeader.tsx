import { Button } from "@/components/ui/button";

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
        className="flex-shrink-0"
        onClick={onStart}
      >
        <span className="text-xs sm:text-sm">
          {isActive ? "En cours" : "Commencer"}
        </span>
      </Button>
    </div>
  );
};