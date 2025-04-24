
import { motion } from "framer-motion";
import { Header } from "@/components/Layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { ForceScoreCard } from "@/components/Progress/ForceScore/ForceScoreCard";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { DetailedStats } from "@/components/Workouts/WorkoutStats/DetailedStats";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, BarChart3, Award, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Stats = () => {
  const { t } = useLanguage();
  
  // Récupérer les statistiques utilisateur
  const { data: userStats } = useQuery({
    queryKey: ['user-summary-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return {
        totalWorkouts: 0,
        totalDuration: 0,
        bestPerformance: 0,
        averageIntensity: 0
      };
      
      const { data } = await supabase
        .from('training_stats')
        .select('*')
        .eq('user_id', user.id);
        
      const stats = data || [];
      
      return {
        totalWorkouts: stats.length,
        totalDuration: stats.reduce((acc, curr) => acc + (curr.session_duration_minutes || 0), 0),
        bestPerformance: Math.max(...stats.map(s => s.total_weight_lifted || 0), 0),
        averageIntensity: stats.length > 0 
          ? stats.reduce((acc, curr) => acc + (curr.perceived_difficulty || 0), 0) / stats.length
          : 0
      };
    }
  });
  
  return (
    <Header>
      <div className="container max-w-7xl mx-auto px-4 pt-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {t("workouts.progress")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("workouts.trackProgressDescription")}
            </p>
          </div>

          {/* Statistiques générales en haut de la page */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard 
              title={t("workouts.stats.totalWorkouts", { fallback: "Entraînements" })} 
              value={userStats?.totalWorkouts || 0} 
              icon={<BarChart3 className="h-4 w-4" />} 
              color="text-blue-500"
            />
            <StatCard 
              title={t("workouts.stats.totalDuration", { fallback: "Durée totale" })} 
              value={userStats?.totalDuration || 0} 
              unit="min" 
              icon={<Clock className="h-4 w-4" />} 
              color="text-green-500"
            />
            <StatCard 
              title={t("workouts.stats.bestPerformance", { fallback: "Meilleure perf" })} 
              value={Math.round(userStats?.bestPerformance || 0)} 
              unit="kg" 
              icon={<Award className="h-4 w-4" />} 
              color="text-purple-500"
            />
            <StatCard 
              title={t("workouts.stats.averageIntensity", { fallback: "Intensité moy." })} 
              value={userStats?.averageIntensity.toFixed(1) || 0} 
              unit="/10" 
              icon={<ArrowUpDown className="h-4 w-4" />} 
              color="text-orange-500"
            />
          </div>

          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="metrics">{t("workouts.tabs.metrics", { fallback: "Métriques" })}</TabsTrigger>
              <TabsTrigger value="performance">{t("workouts.tabs.performance", { fallback: "Performance" })}</TabsTrigger>
              <TabsTrigger value="details">{t("workouts.tabs.history", { fallback: "Historique" })}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="metrics" className="space-y-6">
              <TrendMetrics />
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <ForceScoreCard />
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">{t("workouts.stats.progression", { fallback: "Progression des entraînements" })}</h3>
                    <DashboardStats />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6">
              <DetailedStats />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Header>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, unit, icon, color }: StatCardProps) => {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{title}</span>
        <div className={color}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </Card>
  );
};

export default Stats;
