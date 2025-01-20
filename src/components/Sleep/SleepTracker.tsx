import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ConnectedDevices } from "./ConnectedDevices";

export const SleepTracker = () => {
  const [recommendedSleep, setRecommendedSleep] = useState<string>("7-8 heures");
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [sleepMinutes, setSleepMinutes] = useState<number>(0);
  const [sleepQuality, setSleepQuality] = useState<number>(5);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserActivityAndCalculateSleep();
  }, []);

  const fetchUserActivityAndCalculateSleep = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch user's activity level and training data
    const { data: questionnaire, error: questionnaireError } = await supabase
      .from('questionnaire_responses')
      .select('experience_level, training_frequency, workout_duration')
      .eq('user_id', user.id)
      .single();

    if (questionnaireError) {
      console.error('Error fetching activity level:', questionnaireError);
      return;
    }

    // Fetch recent training stats to assess physical expenditure
    const { data: trainingStats, error: statsError } = await supabase
      .from('training_stats')
      .select('calories_burned, session_duration_minutes')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(7);

    if (statsError) {
      console.error('Error fetching training stats:', statsError);
      return;
    }

    // Calculate recommended sleep based on activity and training data
    const recommendedMinutes = calculateRecommendedSleep(
      questionnaire?.experience_level,
      questionnaire?.training_frequency,
      questionnaire?.workout_duration,
      trainingStats
    );

    const hours = Math.floor(recommendedMinutes / 60);
    const minutes = recommendedMinutes % 60;
    setRecommendedSleep(`${hours}h${minutes.toString().padStart(2, '0')}`);
  };

  const calculateRecommendedSleep = (
    activityLevel: string | null,
    trainingFrequency: string | null,
    workoutDuration: string | null,
    trainingStats: any[]
  ): number => {
    // Base sleep time in minutes (7 hours = 420 minutes)
    let baseMinutes = 420;

    // Adjust based on activity level
    const activityMultiplier = {
      sedentary: 0,
      lightly_active: 15,
      moderately_active: 30,
      very_active: 45,
      extra_active: 60
    }[activityLevel || 'moderately_active'] || 30;

    // Adjust based on training frequency
    const frequencyMultiplier = {
      '1-2': 10,
      '3-4': 20,
      '5+': 30
    }[trainingFrequency || '3-4'] || 20;

    // Calculate average daily calorie burn from recent workouts
    const avgCaloriesBurned = trainingStats?.length
      ? trainingStats.reduce((acc, stat) => acc + (stat.calories_burned || 0), 0) / trainingStats.length
      : 0;

    // Additional minutes based on calorie burn
    const calorieAdjustment = Math.floor(avgCaloriesBurned / 100) * 5;

    // Calculate total recommended sleep time in minutes
    const totalMinutes = baseMinutes + activityMultiplier + frequencyMultiplier + calorieAdjustment;

    return totalMinutes;
  };

  const addSleepEntry = async (hours: number, minutes: number, quality: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer votre sommeil",
        variant: "destructive",
      });
      return;
    }

    const totalMinutes = hours * 60 + minutes;
    const now = new Date();
    const startTime = new Date(now.getTime() - totalMinutes * 60000);

    const sleepData = {
      user_id: user.id,
      start_time: startTime.toISOString(),
      end_time: now.toISOString(),
      total_duration_minutes: totalMinutes,
      quality_metrics: {
        sleep_quality: quality,
        deep_sleep_percentage: Math.round(quality * 10),
        rem_sleep_percentage: Math.round(quality * 8),
      },
      environmental_data: {
        temperature: 20,
        noise_level: 25,
        light_level: 2
      }
    };

    const { error } = await supabase
      .from('sleep_sessions')
      .insert(sleepData);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les données de sommeil",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Données de sommeil enregistrées",
    });
  };

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

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Durée de sommeil
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="number"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    min={0}
                    max={24}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <span className="ml-2">heures</span>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={sleepMinutes}
                    onChange={(e) => setSleepMinutes(Number(e.target.value))}
                    min={0}
                    max={59}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <span className="ml-2">minutes</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Qualité du sommeil (1-10)
              </label>
              <input
                type="range"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(Number(e.target.value))}
                min={1}
                max={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Mauvaise</span>
                <span>Excellente</span>
              </div>
            </div>

            <Button
              onClick={() => addSleepEntry(sleepHours, sleepMinutes, sleepQuality)}
              className="w-full"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};