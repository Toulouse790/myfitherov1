import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SleepEntry {
  id: string;
  date: string;
  hours: number;
  quality: number;
}

export const SleepTracker = () => {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const { toast } = useToast();

  const addSleepEntry = (hours: number, quality: number) => {
    const newEntry: SleepEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      hours,
      quality,
    };

    setEntries([...entries, newEntry]);
    toast({
      title: "Sommeil enregistré",
      description: `${hours}h de sommeil ajoutées`,
    });
  };

  const getAverageHours = () => {
    if (entries.length === 0) return 0;
    return entries.reduce((acc, entry) => acc + entry.hours, 0) / entries.length;
  };

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
              <p className="text-2xl font-bold">{getAverageHours().toFixed(1)}h</p>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-5 h-5 text-yellow-400"
                  fill={star <= Math.round(getAverageHours() / 2) ? "currentColor" : "none"}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[6, 7, 8].map((hours) => (
              <Button
                key={hours}
                variant="outline"
                className="w-full"
                onClick={() => addSleepEntry(hours, 3)}
              >
                {hours}h
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
                <span className="font-medium">{entry.hours}h</span>
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