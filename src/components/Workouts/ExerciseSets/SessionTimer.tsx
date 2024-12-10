import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Timer } from "lucide-react";

export const SessionTimer = () => {
  const [sessionDuration, setSessionDuration] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4 flex items-center justify-between bg-secondary/10">
      <div className="flex items-center gap-2">
        <Timer className="h-5 w-5 text-primary" />
        <span className="font-medium">Durée totale:</span>
      </div>
      <span className="font-mono text-xl">{formatTime(sessionDuration)}</span>
    </Card>
  );
};