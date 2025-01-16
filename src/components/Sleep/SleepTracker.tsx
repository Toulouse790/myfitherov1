import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Star, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SleepEntry {
  id: string;
  date: string;
  hours: number;
  minutes: number;
  quality: number;
}

export const SleepTracker = () => {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [recommendedSleep, setRecommendedSleep] = useState<string>("");
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

  const addSleepEntry = (hours: number, minutes: number, quality: number) => {
    const newEntry: SleepEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      hours,
      minutes,
      quality,
    };

    setEntries([...entries, newEntry]);
    toast({
      title: "Sommeil enregistré",
      description: `${formatTime(hours, minutes)} de sommeil ajoutées`,
    });
  };

  const getAverageHours = () => {
    if (entries.length === 0) return { hours: 0, minutes: 0 };
    const totalMinutes = entries.reduce((acc, entry) => acc + (entry.hours * 60 + entry.minutes), 0);
    const averageMinutes = totalMinutes / entries.length;
    return {
      hours: Math.floor(averageMinutes / 60),
      minutes: Math.round(averageMinutes % 60)
    };
  };

  const formatTime = (hours: number, minutes: number) => {
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const average = getAverageHours();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="w-5 h-5" />
          Suivi du sommeil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Moyenne de sommeil</p>
              <p className="text-2xl font-bold">{formatTime(average.hours, average.minutes)}</p>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-5 h-5 text-yellow-400"
                  fill={star <= Math.round((average.hours * 60 + average.minutes) / 120) ? "currentColor" : "none"}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Info className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Temps de sommeil recommandé : <span className="font-medium">{recommendedSleep}</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { h: 6, m: 0 },
              { h: 7, m: 0 },
              { h: 7, m: 30 },
              { h: 8, m: 0 },
              { h: 8, m: 30 },
              { h: 9, m: 0 }
            ].map(({ h, m }) => (
              <Button
                key={`${h}${m}`}
                variant="outline"
                className="w-full"
                onClick={() => addSleepEntry(h, m, 3)}
              >
                {formatTime(h, m)}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            {entries.slice().reverse().map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-2 rounded bg-muted/50"
              >
                <span className="text-sm">{entry.date}</span>
                <span className="font-medium">{formatTime(entry.hours, entry.minutes)}</span>
              </div>
            ))}
            {entries.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Aucune donnée de sommeil
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
