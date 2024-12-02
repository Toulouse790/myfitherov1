import { WorkoutCard } from "./WorkoutCard";

const workouts = [
  {
    id: 1,
    title: "Full Body",
    duration: "45 min",
    exercises: 8,
  },
  {
    id: 2,
    title: "Haut du corps",
    duration: "30 min",
    exercises: 6,
  },
  {
    id: 3,
    title: "Bas du corps",
    duration: "40 min",
    exercises: 7,
  },
];

export const WorkoutList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          title={workout.title}
          duration={workout.duration}
          exercises={workout.exercises}
          onClick={() => {
            // Cette fonction sera implémentée plus tard
            console.log("Démarrer la séance:", workout.title);
          }}
        />
      ))}
    </div>
  );
};