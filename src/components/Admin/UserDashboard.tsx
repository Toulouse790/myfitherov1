import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WidgetGrid } from "@/components/Widgets/WidgetGrid";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { StrengthScore } from "@/components/Dashboard/StrengthScore";

export const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tableau de bord utilisateur</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
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
          <DashboardStats />
        </TabsContent>

        <TabsContent value="widgets">
          <WidgetGrid />
        </TabsContent>
      </Tabs>
    </div>
  );
};