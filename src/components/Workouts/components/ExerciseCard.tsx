import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  difficulty: string[];
  location?: string[];
  image_url?: string;
  video_url?: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  isSelected: boolean;
  onToggle: () => void;
}

export const ExerciseCard = ({ exercise, isSelected, onToggle }: ExerciseCardProps) => {
  return (
    <Card 
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium">{exercise.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {exercise.muscle_group}
          </p>
        </div>
        <Button 
          variant={isSelected ? "default" : "ghost"} 
          size="icon" 
          className="shrink-0"
        >
          <Check className={`h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
        </Button>
      </div>
    </Card>
  );
};