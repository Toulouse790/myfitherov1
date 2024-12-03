import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Activity, Calendar, TrendingUp } from "lucide-react";

interface WorkoutSummaryProps {
  dailyStats: {
    duration: number;
    calories: number;
    exercises: number;
  };
  weeklyStats: {
    workouts: number;
    totalDuration: number;
    avgIntensity: number;
  };
  monthlyStats: {
    totalWorkouts: number;
    progress: number;
    streak: number;
  };
}

export const WorkoutSummary = () => {
  // Mock data - à remplacer par des données réelles
  const summaryData: WorkoutSummaryProps = {
    dailyStats: {
      duration: 61,
      calories: 450,
      exercises: 8,
    },
    weeklyStats: {
      workouts: 4,
      totalDuration: 240,
      avgIntensity: 85,
    },
    monthlyStats: {
      totalWorkouts: 16,
      progress: 90,
      streak: 4,
    },
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily" className="text-xs sm:text-sm">
            <Activity className="w-4 h-4 mr-2" />
            Aujourd'hui
          </TabsTrigger>
          <TabsTrigger value="weekly" className="text-xs sm:text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            Semaine
          </TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs sm:text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Mois
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {summaryData.dailyStats.duration} min
              </p>
              <p className="text-sm text-muted-foreground">Durée</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {summaryData.dailyStats.calories} kcal
              </p>
              <p className="text-sm text-muted-foreground">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {summaryData.dailyStats.exercises}
              </p>
              <p className="text-sm text-muted-foreground">Exercices</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {summaryData.weeklyStats.workouts}
              </p>
              <p className="text-sm text-muted-foreground">Entraînements</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {summaryData.weeklyStats.totalDuration} min
              </p>
              <p className="text-sm text-muted-foreground">Durée totale</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {summaryData.weeklyStats.avgIntensity}%
              </p>
              <p className="text-sm text-muted-foreground">Intensité moy.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {summaryData.monthlyStats.totalWorkouts}
              </p>
              <p className="text-sm text-muted-foreground">Total séances</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {summaryData.monthlyStats.progress}%
              </p>
              <p className="text-sm text-muted-foreground">Progression</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {summaryData.monthlyStats.streak} jours
              </p>
              <p className="text-sm text-muted-foreground">Série active</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};