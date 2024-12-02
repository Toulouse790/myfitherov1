import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Flame } from "lucide-react";

interface WorkoutCardProps {
  workout: {
    title: string;
    muscleGroup: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: number;
      calories: number;
    }>;
    totalCalories: number;
  };
}

export const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const { title, exercises, totalCalories } = workout;

  return (
    <Card className="w-full animate-fade-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <Badge variant="outline" className="bg-primary text-primary-foreground">
            {exercises.length} exercices
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-primary" />
            <span className="text-sm">{exercises.length} exercices</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-sm">{totalCalories} kcal</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {exercises.map((exercise, index) => (
            <div key={index} className="text-sm text-muted-foreground">
              {exercise.name} - {exercise.sets} × {exercise.reps}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};