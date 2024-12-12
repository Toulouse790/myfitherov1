import { Layout } from "@/components/Layout/Header";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { WorkoutSummary } from "@/components/Dashboard/WorkoutSummary";

export default function Index() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-6">
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
      </div>
    </Layout>
  );
}