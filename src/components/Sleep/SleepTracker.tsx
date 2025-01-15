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
    fetchUserActivityLevel();
  }, []);

  const fetchUserActivityLevel = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('experience_level')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching activity level:', error);
      return;
    }

    // Définir le temps de sommeil recommandé en fonction du niveau d'activité
    const recommendedHours = getRecommendedSleep(data?.experience_level);
    setRecommendedSleep(recommendedHours);
  };

  const getRecommendedSleep = (activityLevel: string | null): string => {
    switch (activityLevel) {
      case 'very_active':
      case 'extra_active':
        return "8-10 heures";
      case 'moderately_active':
        return "7-9 heures";
      case 'lightly_active':
        return "7-8 heures";
      case 'sedentary':
        return "7 heures";
      default:
        return "7-8 heures";
    }
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