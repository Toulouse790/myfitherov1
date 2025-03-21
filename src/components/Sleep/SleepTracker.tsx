
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { ConnectedDevices } from "./ConnectedDevices";
import { useSleepTracking } from "@/hooks/use-sleep-tracking";
import { Loader2, Moon, Sun } from "lucide-react";

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

  useEffect(() => {
    fetchUserActivityAndCalculateSleep();
  }, []);

  const fetchUserActivityAndCalculateSleep = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      // Fetch user's activity level and training data - get most recent response
      const { data: questionnaire, error: questionnaireError } = await supabase
        .from('questionnaire_responses')
        .select('experience_level, training_frequency, workout_duration')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (questionnaireError) {
        console.error('Error fetching activity level:', questionnaireError);
        throw questionnaireError;
      }

      if (!questionnaire || questionnaire.length === 0) {
        console.log('No questionnaire data found');
        return;
      }

      const userQuestionnaire = questionnaire[0];

      // Fetch recent training stats to assess physical expenditure
      const { data: trainingStats, error: statsError } = await supabase
        .from('training_stats')
        .select('calories_burned, session_duration_minutes')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(7);

      if (statsError) {
        console.error('Error fetching training stats:', statsError);
        throw statsError;
      }

      // Calculate recommended sleep based on activity and training data
      const recommendation = calculateRecommendedSleep(
        userQuestionnaire.experience_level,
        userQuestionnaire.training_frequency,
        userQuestionnaire.workout_duration,
        trainingStats || []
      );

      setRecommendedSleep(`${recommendation.hours}h${recommendation.minutes.toString().padStart(2, '0')}`);
    } catch (error) {
      console.error('Error calculating recommended sleep:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Suivi du sommeil</h2>
            <p className="text-muted-foreground">
              Temps de sommeil recommandé : {recommendedSleep}
            </p>
          </div>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Saisie manuelle</TabsTrigger>
              <TabsTrigger value="auto">Suivi automatique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is-nap" className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <span>Type de sommeil</span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-nap"
                    checked={isNap}
                    onCheckedChange={setIsNap}
                  />
                  <span className="text-sm">{isNap ? 'Sieste' : 'Nuit'}</span>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Durée de sommeil
                  </Label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Input
                          type="number"
                          value={sleepHours}
                          onChange={(e) => setSleepHours(Number(e.target.value))}
                          min={0}
                          max={24}
                          className="w-full"
                        />
                        <span className="ml-2">heures</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Input
                          type="number"
                          value={sleepMinutes}
                          onChange={(e) => setSleepMinutes(Number(e.target.value))}
                          min={0}
                          max={59}
                          className="w-full"
                        />
                        <span className="ml-2">minutes</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Sun className="h-4 w-4" />
                    <span>Qualité du sommeil (1-10)</span>
                  </Label>
                  <input
                    type="range"
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(Number(e.target.value))}
                    min={1}
                    max={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Mauvaise</span>
                    <span>Excellente</span>
                  </div>
                </div>

                <Button
                  onClick={addSleepSession}
                  className="w-full"
                  size="lg"
                >
                  Enregistrer
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="auto" className="space-y-4 mt-4">
              <ConnectedDevices />
              
              <div className="text-center text-muted-foreground">
                <p>Connectez un appareil pour suivre automatiquement votre sommeil</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
