import { Card } from "@/components/ui/card";
import { Timer, Flame } from "lucide-react";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: number;
  image: string;
  planned: {
    duration: number;
    calories: number;
  };
  actual: {
    duration: number;
    calories: number;
  };
}

export const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video">
        <img 
          src={exercise.image} 
          alt={exercise.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-lg">{exercise.name}</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center p-2 bg-secondary/10 rounded-lg">
            <div className="font-medium">{exercise.sets}</div>
            <div className="text-muted-foreground">Séries</div>
          </div>
          <div className="text-center p-2 bg-secondary/10 rounded-lg">
            <div className="font-medium">{exercise.reps}</div>
            <div className="text-muted-foreground">Reps</div>
          </div>
          <div className="text-center p-2 bg-secondary/10 rounded-lg">
            <div className="font-medium">{exercise.rest}s</div>
            <div className="text-muted-foreground">Repos</div>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className={exercise.actual.duration > exercise.planned.duration ? "text-green-500" : ""}>
              {exercise.actual.duration} min
            </span>
            <span className="text-muted-foreground">/ {exercise.planned.duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-muted-foreground" />
            <span className={exercise.actual.calories > exercise.planned.calories ? "text-green-500" : ""}>
              {exercise.actual.calories}
            </span>
            <span className="text-muted-foreground">/ {exercise.planned.calories} kcal</span>
          </div>
        </div>
      </div>
    </Card>
  );
};