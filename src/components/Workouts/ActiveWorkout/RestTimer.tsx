
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Plus, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

interface RestTimerProps {
  onComplete: () => void;
  initialTime?: number;
  onRestTimeChange?: (adjustment: number) => void;
}

export const RestTimer = ({ onComplete, initialTime = 90, onRestTimeChange }: RestTimerProps) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  const [currentInitialTime, setCurrentInitialTime] = useState(initialTime);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    if (!isPaused) {
      const timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, isPaused, onComplete]);

  const adjustTime = (seconds: number) => {
    const newTime = Math.max(15, Math.min(180, timeLeft + seconds));
    console.log(`Adjusting rest time by ${seconds}s. New time: ${newTime}s`);
    setTimeLeft(newTime);
    setCurrentInitialTime(newTime); // Update the reference time for progress calculation
    
    if (onRestTimeChange) {
      onRestTimeChange(seconds);
    }
  };

  const progress = ((currentInitialTime - timeLeft) / currentInitialTime) * 100;

  return (
    <Card className="p-6 bg-muted">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">{t("workouts.restTime")}</h3>
          <div className="text-4xl font-bold">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>

        <Progress value={progress} className="w-full" />

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => adjustTime(-15)}
            disabled={timeLeft <= 15}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
          >
            <Timer className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => adjustTime(15)}
            disabled={timeLeft >= 180}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button 
          className="w-full" 
          onClick={() => setTimeLeft(0)}
        >
          {t("workouts.skipRest")}
        </Button>
      </div>
    </Card>
  );
};
