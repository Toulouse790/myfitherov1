import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Exercise {
  id: string;
  name: string;
  media_url?: string | null;
}

interface ExerciseCardProps {
  exercise: Exercise;
  isSelected: boolean;
  onToggle: () => void;
}

export const ExerciseCard = ({ exercise, isSelected, onToggle }: ExerciseCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow bg-card">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={exercise.id}
            checked={isSelected}
            onCheckedChange={onToggle}
          />
          <label
            htmlFor={exercise.id}
            className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {exercise.name}
          </label>
        </div>
      </CardHeader>
      {exercise.media_url && (
        <CardContent>
          <div className="relative aspect-video mb-2 rounded-md overflow-hidden">
            <img
              src={exercise.media_url}
              alt={`Démonstration de l'exercice ${exercise.name}`}
              className="object-cover w-full h-full"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};