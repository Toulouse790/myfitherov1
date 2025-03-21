
import { Header } from "@/components/Layout/Header";
import { ActiveWorkout } from "@/components/Workouts/ActiveWorkout";

export default function WorkoutSessionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4">
        <ActiveWorkout />
      </div>
    </div>
  );
}
