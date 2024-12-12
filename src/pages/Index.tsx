import { Header } from "@/components/Layout/Header";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { WorkoutSummary } from "@/components/Dashboard/WorkoutSummary";
import { useAuth } from "@/hooks/use-auth";

export default function Index() {
  const { loading } = useAuth();

  return (
    <Header>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Chargement...
          </div>
        ) : (
          <>
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TrendMetrics />
                <WorkoutSummary />
              </div>
              <div className="space-y-6">
                <WorkoutSuggestions />
              </div>
            </div>
          </>
        )}
      </div>
    </Header>
  );
}