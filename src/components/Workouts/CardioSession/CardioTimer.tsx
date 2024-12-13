import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pause, Play, StopCircle, Timer } from "lucide-react";
import { motion } from "framer-motion";
import { formatWorkoutTime } from "@/utils/time";

interface CardioTimerProps {
  exerciseName: string;
  onComplete: () => void;
}

export const CardioTimer = ({ exerciseName, onComplete }: CardioTimerProps) => {
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          // Calcul simplifié des calories (à améliorer avec une formule plus précise)
          setCalories(Math.round(newDuration * 0.15));
          return newDuration;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const handleTogglePause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setIsRunning(false);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{exerciseName}</h2>
          <p className="text-muted-foreground">Session en cours</p>
        </div>

        <div className="flex justify-center items-center gap-4">
          <Timer className="w-8 h-8 text-primary" />
          <span className="text-4xl font-mono font-bold">
            {formatWorkoutTime(duration)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Calories brûlées</span>
            <span>{calories} kcal</span>
          </div>
          <Progress value={(calories / 300) * 100} className="h-2" />
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant={isRunning ? "destructive" : "default"}
            size="lg"
            onClick={handleTogglePause}
            className="w-32"
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Reprendre
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleStop}
            className="w-32"
          >
            <StopCircle className="mr-2 h-4 w-4" />
            Terminer
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};