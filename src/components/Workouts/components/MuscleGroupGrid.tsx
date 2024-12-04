import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, ChevronRight, CheckSquare } from "lucide-react";
import { muscleGroups } from "../workoutConstants";

interface MuscleGroupGridProps {
  searchQuery: string;
  onMuscleGroupClick: (muscleId: string) => void;
}

export const MuscleGroupGrid = ({ searchQuery, onMuscleGroupClick }: MuscleGroupGridProps) => {
  const filteredMuscleGroups = muscleGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredMuscleGroups.map((muscle) => (
        <Card
          key={muscle.id}
          onClick={() => onMuscleGroupClick(muscle.id)}
          className="p-4 cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{muscle.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {muscle.selectedExercises}/{muscle.totalExercises} exercices
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
          {muscle.selectedExercises > 0 && (
            <Badge 
              className="absolute top-2 right-2 bg-primary"
              variant="secondary"
            >
              <CheckSquare className="h-3 w-3 mr-1" />
              {muscle.selectedExercises}
            </Badge>
          )}
        </Card>
      ))}
    </div>
  );
};