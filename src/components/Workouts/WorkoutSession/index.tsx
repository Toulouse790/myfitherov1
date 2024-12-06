import { Header } from "@/components/Layout/Header";
import { ExerciseList } from "./ExerciseList";

export const WorkoutSession = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div>
        <ExerciseList />
      </div>
    </div>
  );
};