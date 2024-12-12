import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { StrengthScore } from "@/components/Dashboard/StrengthScore";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { WorkoutSummary } from "@/components/Dashboard/WorkoutSummary";
import { Header } from "@/components/Layout/Header";

const Stats = () => {
  return (
    <Header>
      <div className="container max-w-7xl mx-auto px-4 pt-6 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Statistiques
          </h1>
          <p className="text-sm text-muted-foreground">
            Suivez vos performances et votre progression
          </p>
        </div>

        <div className="space-y-6">
          <DashboardStats />
          <div className="grid md:grid-cols-2 gap-4">
            <StrengthScore />
            <TrendMetrics />
          </div>
          <WorkoutSummary />
        </div>
      </div>
    </Header>
  );
};

export default Stats;