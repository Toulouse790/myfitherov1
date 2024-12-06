import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { StrengthScore } from "@/components/Dashboard/StrengthScore";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { WorkoutSummary } from "@/components/Dashboard/WorkoutSummary";
import { Header } from "@/components/Layout/Header";

const Stats = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-3xl mx-auto px-4 pt-12 pb-20">
        <div className="mb-4 text-center">
          <h1 className="text-xl font-bold">
            Statistiques
          </h1>
          <p className="text-sm text-muted-foreground">
            Suivez vos performances et votre progression
          </p>
        </div>

        <div className="space-y-6">
          <DashboardStats />
          <WorkoutSummary />
          <div className="grid md:grid-cols-2 gap-4">
            <StrengthScore />
            <TrendMetrics />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Stats;