
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseTypeViewProps {
  exerciseType: 'cardio' | 'strength';
  exerciseName: string;
  onComplete: (exerciseId: string, exerciseName: string, difficulty: string, notes: string, calories: number) => Promise<void>;
}

export const ExerciseTypeView = ({ exerciseType, exerciseName, onComplete }: ExerciseTypeViewProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [duration, setDuration] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  const [intensity, setIntensity] = React.useState<'low' | 'moderate' | 'high'>('moderate');

  // Pour les exercices de musculation
  const [sets, setSets] = React.useState([{ weight: 20, reps: 12, completed: false }]);
  const [restTimer, setRestTimer] = React.useState<number | null>(null);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleAddSet = () => {
    setSets(prev => [...prev, { weight: prev[prev.length - 1].weight, reps: 12, completed: false }]);
  };

  const handleSetComplete = (index: number) => {
    setSets(prev => prev.map((set, i) => i === index ? { ...set, completed: true } : set));
    setRestTimer(90);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (exerciseType === 'cardio') {
    return (
      <Card className="mx-auto max-w-md p-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-4xl font-mono font-bold">{formatTime(duration)}</div>

          <div className="w-full space-y-4">
            <select 
              className="w-full p-4 text-lg border rounded-lg bg-background"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value as 'low' | 'moderate' | 'high')}
            >
              <option value="low">{t("workouts.easy")}</option>
              <option value="moderate">{t("workouts.medium")}</option>
              <option value="high">{t("workouts.hard")}</option>
            </select>

            <Button 
              className="w-full h-14 text-lg"
              variant={isActive ? "destructive" : "default"}
              onClick={() => setIsActive(!isActive)}
            >
              <Timer className="mr-2 h-6 w-6" />
              {isActive ? t("common.stop") : t("common.start")}
            </Button>

            {duration > 0 && !isActive && (
              <Button 
                className="w-full h-14 text-lg"
                onClick={() => onComplete(exerciseName, exerciseName, intensity, "", Math.round(duration / 60 * 10))}
              >
                {t("workouts.completeExercise")}
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md p-4">
      <div className="space-y-6">
        <div className="space-y-4">
          {sets.map((set, index) => (
            <div key={index} className="flex flex-col p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{t("workouts.set")} {index + 1}</span>
                {set.completed && <span className="text-primary">{t("workouts.completed")} ✓</span>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">{t("workouts.weight_kg")}</label>
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => setSets(prev => prev.map((s, i) => 
                      i === index ? { ...s, weight: Number(e.target.value) } : s
                    ))}
                    className="w-full p-4 text-lg border rounded-lg"
                    placeholder={t("workouts.weight")}
                    disabled={set.completed}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">{t("workouts.workouts_reps")}</label>
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => setSets(prev => prev.map((s, i) => 
                      i === index ? { ...s, reps: Number(e.target.value) } : s
                    ))}
                    className="w-full p-4 text-lg border rounded-lg"
                    placeholder={t("workouts.workouts_reps")}
                    disabled={set.completed}
                  />
                </div>
              </div>

              {!set.completed && (
                <Button 
                  className="w-full h-14 text-lg"
                  onClick={() => handleSetComplete(index)}
                  disabled={restTimer !== null}
                >
                  {t("workouts.validateSet")}
                </Button>
              )}
            </div>
          ))}

          {restTimer && (
            <div className="fixed bottom-20 left-0 right-0 mx-auto w-max bg-primary text-primary-foreground px-8 py-4 rounded-full shadow-lg animate-pulse">
              <div className="flex items-center gap-2">
                <Timer className="h-6 w-6" />
                <span className="text-lg font-medium">{t("workouts.rest")}: {restTimer}s</span>
              </div>
            </div>
          )}

          <Button 
            className="w-full h-14 text-lg"
            variant="outline"
            onClick={handleAddSet}
          >
            <Dumbbell className="mr-2 h-6 w-6" />
            {t("workouts.addSet")}
          </Button>

          {sets.every(set => set.completed) && (
            <Button 
              className="w-full h-14 text-lg"
              onClick={() => onComplete(
                exerciseName,
                exerciseName,
                "moderate",
                "",
                sets.reduce((acc, set) => acc + (set.weight * set.reps * 0.2), 0)
              )}
            >
              {t("workouts.completeExercise")}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
