import { WorkoutCard } from "./WorkoutCard";
import { WorkoutData } from "./workoutConstants";

interface WorkoutListProps {
  workouts: WorkoutData[];
}

export const WorkoutList = ({ workouts }: WorkoutListProps) => {
  if (workouts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground animate-fade-in">
        Aucune séance ne correspond à vos critères.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {workouts.map((workout, index) => (
        <div
          key={workout.id}
          className="opacity-0 animate-fade-in"
          style={{
            animationDelay: `${index * 150}ms`,
            animationFillMode: 'forwards'
          }}
        >
          <WorkoutCard workout={{
            title: workout.title,
            muscleGroup: workout.muscleGroup,
            exercises: workout.exercises.map(ex => ({
              name: ex.name,
              sets: ex.sets || 3,
              reps: ex.reps || 12,
              calories: ex.calories || 0
            })),
            totalCalories: workout.exercises.reduce((acc, ex) => acc + (ex.calories || 0), 0)
          }} />
        </div>
      ))}
    </div>
  );
};