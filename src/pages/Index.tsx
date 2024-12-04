import { WidgetGrid } from "@/components/Widgets/WidgetGrid";
import { NextWorkoutCard } from "@/components/Workouts/NextWorkoutCard";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { useWelcomeToast } from "@/hooks/useWelcomeToast";

const Index = () => {
  useWelcomeToast();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Header />
      
      <main className="w-full max-w-4xl mx-auto px-4 pt-16 pb-20">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-black">
            Tableau de bord
          </h1>
          <p className="text-sm bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-medium">
            Suivez vos progrès et atteignez vos objectifs
          </p>
        </div>

        <div className="space-y-4">
          <NextWorkoutCard />
          <WorkoutSuggestions />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;