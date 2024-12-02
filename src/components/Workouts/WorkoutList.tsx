import { WorkoutCard } from "./WorkoutCard";
import { sampleWorkouts } from "./workoutConstants";

export const WorkoutList = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sampleWorkouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
};