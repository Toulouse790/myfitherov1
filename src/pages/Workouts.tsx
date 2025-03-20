
import { Header } from "@/components/Layout/Header";
import { WorkoutFlowManager } from "@/components/Workouts/WorkoutFlow/WorkoutFlowManager";

export const Workouts = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-20">
        <WorkoutFlowManager />
      </div>
    </div>
  );
};

export default Workouts;
