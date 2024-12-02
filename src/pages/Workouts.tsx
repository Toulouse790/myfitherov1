import { WorkoutList } from "@/components/Workouts/WorkoutList";
import { CreateWorkoutDialog } from "@/components/Workouts/CreateWorkoutDialog";

const Workouts = () => {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Entraînements</h1>
        <CreateWorkoutDialog />
      </div>

      <WorkoutList />
    </div>
  );
};

export default Workouts;