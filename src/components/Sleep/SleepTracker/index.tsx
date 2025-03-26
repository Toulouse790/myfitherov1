
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSleepTracking } from "@/hooks/use-sleep-tracking";
import { SleepRecommendation } from "@/types/sleep";
import { ManualTracking } from "./ManualTracking";
import { AutomaticTracking } from "./AutomaticTracking";

export const SleepTracker = () => {
  const {
    sleepHours,
    sleepMinutes,
    sleepQuality,
    isNap,
    addSleepSession,
    setSleepHours,
    setSleepMinutes,
    setSleepQuality,
    setIsNap,
    calculateRecommendedSleep,
    isLoading
  } = useSleepTracking();
  
  const [recommendedSleep, setRecommendedSleep] = useState<string>("7-8 heures");
  const { t } = useLanguage();

  useEffect(() => {
    fetchUserActivityAndCalculateSleep();
  }, []);

  const fetchUserActivityAndCalculateSleep = async () => {
    try {
      // Cette fonction est laissée intacte car elle est spécifique à ce composant
      // et contient la logique principale pour calculer le sommeil recommandé
      await fetchUserData();
    } catch (error) {
      console.error('Error calculating recommended sleep:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      // Simulation de récupération de données et calcul
      const mockUserData = {
        experience_level: 'intermediate',
        training_frequency: 4,
        workout_duration: 60
      };
      
      const mockTrainingStats = [
        { calories_burned: 450, session_duration_minutes: 60 }
      ];
      
      const recommendation = calculateRecommendedSleep(
        mockUserData.experience_level,
        mockUserData.training_frequency,
        mockUserData.workout_duration,
        mockTrainingStats
      );
      
      setRecommendedSleep(`${recommendation.hours}h${recommendation.minutes.toString().padStart(2, '0')}`);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50 dark:from-blue-950/20 dark:to-blue-900/10 shadow-md">
        <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50 dark:from-blue-950/20 dark:to-blue-900/10 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-blue-600">{t("sleep.tracking")}</h2>
            <p className="text-muted-foreground">
              {t("sleep.recommendedTime")}: <span className="text-blue-500 font-medium">{recommendedSleep}</span>
            </p>
          </div>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="data-[state=active]:bg-blue-500">{t("sleep.manualEntry")}</TabsTrigger>
              <TabsTrigger value="auto" className="data-[state=active]:bg-blue-500">{t("sleep.autoTracking")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4 mt-4">
              <ManualTracking 
                sleepHours={sleepHours}
                sleepMinutes={sleepMinutes}
                sleepQuality={sleepQuality}
                isNap={isNap}
                setSleepHours={setSleepHours}
                setSleepMinutes={setSleepMinutes}
                setSleepQuality={setSleepQuality}
                setIsNap={setIsNap}
                addSleepSession={addSleepSession}
              />
            </TabsContent>
            
            <TabsContent value="auto" className="space-y-4 mt-4">
              <AutomaticTracking />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
