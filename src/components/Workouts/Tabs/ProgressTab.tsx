
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineChart, Calendar, Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function ProgressTab() {
  const { t } = useLanguage();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="bg-primary/5 pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-5 w-5 text-primary" />
            {t("workouts.nextGoals")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <motion.div variants={item} className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{t("workouts.goals.trainThreeTimes")}</span>
                <span className="text-sm text-muted-foreground">2/3</span>
              </div>
              <Progress value={66} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{t("workouts.goals.increaseBenchPress")}</span>
                <span className="text-sm text-muted-foreground">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{t("workouts.goals.reachTrainingHours")}</span>
                <span className="text-sm text-muted-foreground">4/10h</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="bg-primary/5 pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t("workouts.latestPerformances")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="weight" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 bg-background/50">
              <TabsTrigger value="weight">Poids</TabsTrigger>
              <TabsTrigger value="sets">Séries</TabsTrigger>
              <TabsTrigger value="time">Temps</TabsTrigger>
            </TabsList>
            <TabsContent value="weight" className="h-[200px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <LineChart className="h-16 w-16 mx-auto mb-2 text-primary/40" />
                <p>{t("workouts.trackProgressDescription")}</p>
              </div>
            </TabsContent>
            <TabsContent value="sets" className="h-[200px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Calendar className="h-16 w-16 mx-auto mb-2 text-primary/40" />
                <p>{t("workouts.trackProgressDescription")}</p>
              </div>
            </TabsContent>
            <TabsContent value="time" className="h-[200px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Trophy className="h-16 w-16 mx-auto mb-2 text-primary/40" />
                <p>{t("workouts.trackProgressDescription")}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
