
import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { WorkoutFlowManager } from "@/components/Workouts/WorkoutFlow/WorkoutFlowManager";
import { useWorkoutExercisesState } from "@/hooks/workout/use-workout-exercises-state";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Workouts = () => {
  const { isLoading } = useWorkoutExercisesState();
  const [initialLoading, setInitialLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    // Simule un temps de chargement initial
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

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
