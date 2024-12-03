import { WidgetGrid } from "@/components/Widgets/WidgetGrid";
import { NextWorkoutCard } from "@/components/Workouts/NextWorkoutCard";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { StrengthScore } from "@/components/Dashboard/StrengthScore";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  useEffect(() => {
    toast({
      title: "Bienvenue sur HealthSync",
      description: "Suivez vos progrès et atteignez vos objectifs fitness.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white dark:from-[#1A1F2C] dark:to-[#2A2F3F]">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 pt-20 pb-24 space-y-6">
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Votre parcours fitness personnalisé
          </h1>
          <p className="mt-2 text-muted-foreground">
            Suivez vos progrès, fixez vos objectifs et dépassez-vous
          </p>
        </div>

        <div className="grid gap-6">
          <div className="rounded-xl bg-white/50 dark:bg-[#1E2330]/50 backdrop-blur-sm p-4 shadow-lg border border-muted">
            <NextWorkoutCard />
          </div>

          <div className="rounded-xl bg-white/50 dark:bg-[#1E2330]/50 backdrop-blur-sm p-4 shadow-lg border border-muted">
            <WorkoutSuggestions />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white/50 dark:bg-[#1E2330]/50 backdrop-blur-sm p-4 shadow-lg border border-muted">
              <StrengthScore />
            </div>
            <div className="rounded-xl bg-white/50 dark:bg-[#1E2330]/50 backdrop-blur-sm p-4 shadow-lg border border-muted">
              <TrendMetrics />
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;