import { motion } from "framer-motion";
import { Header } from "@/components/Layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { ForceScoreCard } from "@/components/Progress/ForceScore/ForceScoreCard";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { WorkoutSummary } from "@/components/Dashboard/WorkoutSummary";
import { Card, CardContent } from "@/components/ui/card";

const Stats = () => {
  const { t } = useLanguage();
  
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

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="progress">Progression</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <DashboardStats />
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <ForceScoreCard />
                <TrendMetrics />
              </div>
              <WorkoutSummary />
            </TabsContent>
            
            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-lg font-medium mb-4">Progression des entraînements</h3>
                      <p className="text-muted-foreground mb-2">Suivez l'évolution de vos performances au fil du temps</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Header>
  );
};

export default Stats;
