import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Target } from "lucide-react";
import { WorkoutData } from "./workoutConstants";

interface WorkoutCardProps {
  workout: WorkoutData;
}

export const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const { title, description, muscleGroup, difficulty, duration, exercises, equipment } = workout;

  return (
    <Card className="w-full animate-fade-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <Badge variant="outline" className="bg-primary text-primary-foreground">
            {muscleGroup}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm">{difficulty}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm">{duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-primary" />
            <span className="text-sm">{exercises} exercices</span>
          </div>
        </div>
        {equipment && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Équipement : {equipment}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};