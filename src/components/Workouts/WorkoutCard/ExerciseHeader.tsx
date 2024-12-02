import { Button } from "@/components/ui/button";

interface ExerciseHeaderProps {
  name: string;
  isActive: boolean;
  onStart: () => void;
}

export const ExerciseHeader = ({ name, isActive, onStart }: ExerciseHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-medium">{name}</h3>
      <Button
        variant={isActive ? "default" : "outline"}
        size="sm"
        onClick={onStart}
      >
        {isActive ? "En cours" : "Commencer"}
      </Button>
    </div>
  );
};