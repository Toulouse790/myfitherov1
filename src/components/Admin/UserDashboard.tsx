import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { StrengthScore } from "@/components/Dashboard/StrengthScore";
import { AdminStats } from "./AdminStats";

export const UserDashboard = () => {
  const { data: userStats } = useQuery({
    queryKey: ['user-dashboard-stats'],
    queryFn: async () => {
      const { data: stats } = await supabase
        .from('training_stats')
        .select(`
          *,
          workout_sessions (
            total_duration_minutes,
            perceived_difficulty
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      return stats;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Tableau de bord utilisateur</h2>
      </div>

      <AdminStats />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <StrengthScore />
            </Card>
            <Card className="p-4">
              <TrendMetrics />
            </Card>
          </div>
          <DashboardStats />
        </TabsContent>

        <TabsContent value="stats">
          <Card className="p-6">
            <DashboardStats />
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-4">
            <Card className="p-6">
              <TrendMetrics />
            </Card>
            <Card className="p-6">
              <StrengthScore />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};