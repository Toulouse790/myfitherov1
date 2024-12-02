import { WorkoutCard } from "./WorkoutCard";
import { WorkoutData } from "./workoutConstants";

interface WorkoutListProps {
  workouts: WorkoutData[];
}

export const WorkoutList = ({ workouts }: WorkoutListProps) => {
  if (workouts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune séance ne correspond à vos critères.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
};