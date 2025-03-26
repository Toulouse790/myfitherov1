
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RecommendedPrograms } from "@/components/Workouts/RecommendedPrograms";
import { ProgressTracker } from "@/components/Workouts/Progress/ProgressTracker";
import { Calendar, Dumbbell, History, LineChart, PlusCircle, Trophy } from "lucide-react";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Workouts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { activeSession, formatTime, sessionTime } = useWorkoutSession();
  const [activeTab, setActiveTab] = useState("home");

  const { data: pastSessions, isLoading: loadingSessions } = useQuery({
    queryKey: ['past-workout-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          program:program_id(name)
        `)
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error("Erreur lors de la récupération des sessions passées:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user && activeTab === "history"
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4">
        {activeSession && (
          <Card className="mb-6 bg-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("workouts.activeSession")}</CardTitle>
              <CardDescription>
                {t("workouts.duration")}: {formatTime(sessionTime)}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                onClick={() => navigate(`/workouts/start/${activeSession.program_id || activeSession.id}`)}
                className="w-full"
              >
                {t("workouts.continueSession")}
              </Button>
            </CardFooter>
          </Card>
        )}

        <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="home">
              <Dumbbell className="h-4 w-4 mr-2" />
              {t("workouts.home")}
            </TabsTrigger>
            <TabsTrigger value="progress">
              <LineChart className="h-4 w-4 mr-2" />
              {t("workouts.progress")}
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              {t("workouts.history")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="home" className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("workouts.startWorkout")}</CardTitle>
                  <CardDescription>
                    {t("workouts.createNewSession")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-4">
                  <Dumbbell className="h-16 w-16 text-primary/60" />
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => navigate('/workouts/generate')}
                    className="w-full"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {t("workouts.newWorkout")}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t("workouts.latestPerformances")}</CardTitle>
                  <CardDescription>
                    {t("workouts.trackProgressDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-4">
                  <Trophy className="h-16 w-16 text-primary/60" />
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("progress")}
                    className="w-full"
                  >
                    <LineChart className="h-4 w-4 mr-2" />
                    {t("workouts.viewProgress")}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <RecommendedPrograms />
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-6">
            <ProgressTracker />
            
            <Card>
              <CardHeader>
                <CardTitle>{t("workouts.nextGoals")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>{t("workouts.goals.trainThreeTimes")}</span>
                    </div>
                    <Button variant="outline" size="sm">{t("common.edit")}</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Dumbbell className="h-4 w-4 mr-2 text-primary" />
                      <span>{t("workouts.goals.increaseBenchPress")}</span>
                    </div>
                    <Button variant="outline" size="sm">{t("common.edit")}</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-primary" />
                      <span>{t("workouts.goals.reachTrainingHours")}</span>
                    </div>
                    <Button variant="outline" size="sm">{t("common.edit")}</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t("workouts.addGoal")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("workouts.workoutHistory")}</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSessions ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg animate-pulse">
                        <div className="h-4 w-1/3 bg-muted rounded"></div>
                        <div className="h-4 w-1/4 bg-muted rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : pastSessions?.length === 0 ? (
                  <div className="text-center py-6">
                    <History className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
                    <p className="text-muted-foreground">
                      {t("workouts.noHistory")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pastSessions?.map((session) => (
                      <div 
                        key={session.id}
                        className="flex justify-between items-center p-3 bg-muted/20 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => navigate(`/workouts/summary/${session.id}`)}
                      >
                        <div>
                          <p className="font-medium">{session.program?.name || t("workouts.customWorkout")}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.created_at).toLocaleDateString()} • {session.total_duration_minutes} min
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{session.calories_burned} kcal</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/workouts/history')}>
                  {t("workouts.viewFullHistory")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
