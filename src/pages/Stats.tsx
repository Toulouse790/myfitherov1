import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { StrengthScore } from "@/components/Dashboard/StrengthScore";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { WorkoutSummary } from "@/components/Dashboard/WorkoutSummary";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";

const Stats = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Header />
      
      <main className="w-full max-w-3xl mx-auto px-4 pt-12 pb-20">
        <div className="mb-4 text-center">
          <h1 className="text-xl font-bold text-black">
            Statistiques
          </h1>
          <p className="text-sm bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-medium">
            Suivez vos performances et votre progression
          </p>
        </div>

        <div className="space-y-4">
          <DashboardStats />
          <WorkoutSummary />
          <div className="grid md:grid-cols-2 gap-3">
            <StrengthScore />
            <TrendMetrics />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Stats;