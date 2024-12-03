import { WidgetGrid } from "@/components/Widgets/WidgetGrid";
import { NextWorkoutCard } from "@/components/Workouts/NextWorkoutCard";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { StrengthScore } from "@/components/Dashboard/StrengthScore";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { WorkoutSummary } from "@/components/Dashboard/WorkoutSummary";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { useWelcomeToast } from "@/hooks/use-welcome-toast";

const Index = () => {
  useWelcomeToast();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 pt-16 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Tableau de bord
          </h1>
          <p className="text-sm text-muted-foreground">
            Suivez vos progrès et atteignez vos objectifs
          </p>
        </div>

        <div className="space-y-4">
          <WorkoutSummary />

          <div className="grid gap-4">
            <NextWorkoutCard />
            
            <div className="grid md:grid-cols-2 gap-4">
              <StrengthScore />
              <TrendMetrics />
            </div>

            <WorkoutSuggestions />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;