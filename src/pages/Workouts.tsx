import { Header } from "@/components/Layout/Header";
import { WorkoutFlowManager } from "@/components/Workouts/WorkoutFlow/WorkoutFlowManager";

export const Workouts = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <WorkoutFlowManager />
      </div>
    </div>
  );
};

export default Workouts;