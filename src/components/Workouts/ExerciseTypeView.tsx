import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExerciseTypeViewProps {
  exerciseType: 'cardio' | 'strength';
  exerciseName: string;
  onComplete: (exerciseId: string, exerciseName: string, difficulty: string, notes: string, calories: number) => Promise<void>;
}

export const ExerciseTypeView = ({ exerciseType, exerciseName, onComplete }: ExerciseTypeViewProps) => {
  const { toast } = useToast();
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
    
    toast({
      title: "Série complétée !",
      description: "Repos de 90 secondes.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (exerciseType === 'cardio') {
    return (
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{exerciseName}</h2>
          <div className="text-2xl font-mono">{formatTime(duration)}</div>
        </div>

        <div className="space-y-4">
          <select 
            className="w-full p-2 border rounded"
            value={intensity}
            onChange={(e) => setIntensity(e.target.value as 'low' | 'moderate' | 'high')}
          >
            <option value="low">Faible intensité</option>
            <option value="moderate">Intensité modérée</option>
            <option value="high">Haute intensité</option>
          </select>

          <Button 
            className="w-full h-12"
            variant={isActive ? "destructive" : "default"}
            onClick={() => setIsActive(!isActive)}
          >
            <Timer className="mr-2 h-5 w-5" />
            {isActive ? "Arrêter" : "Démarrer"}
          </Button>

          {duration > 0 && !isActive && (
            <Button 
              className="w-full"
              onClick={() => onComplete(exerciseName, exerciseName, intensity, "", Math.round(duration / 60 * 10))}
            >
              Terminer l'exercice
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{exerciseName}</h2>
        <Button variant="outline" onClick={handleAddSet}>
          Ajouter une série
        </Button>
      </div>

      <div className="space-y-4">
        {sets.map((set, index) => (
          <div key={index} className="flex items-center gap-4 p-4 border rounded">
            <span className="font-medium">Série {index + 1}</span>
            <input
              type="number"
              value={set.weight}
              onChange={(e) => setSets(prev => prev.map((s, i) => 
                i === index ? { ...s, weight: Number(e.target.value) } : s
              ))}
              className="w-20 p-2 border rounded"
              placeholder="Poids"
            />
            <span>kg</span>
            <input
              type="number"
              value={set.reps}
              onChange={(e) => setSets(prev => prev.map((s, i) => 
                i === index ? { ...s, reps: Number(e.target.value) } : s
              ))}
              className="w-20 p-2 border rounded"
              placeholder="Reps"
            />
            <span>reps</span>
            {!set.completed && (
              <Button 
                className="ml-auto"
                onClick={() => handleSetComplete(index)}
              >
                Valider
              </Button>
            )}
          </div>
        ))}

        {restTimer && (
          <div className="text-center p-4 bg-muted rounded">
            <Timer className="mx-auto h-6 w-6 mb-2" />
            <div className="text-2xl font-mono">{restTimer}s</div>
          </div>
        )}

        {sets.every(set => set.completed) && (
          <Button 
            className="w-full"
            onClick={() => onComplete(
              exerciseName,
              exerciseName,
              "moderate",
              "",
              sets.reduce((acc, set) => acc + (set.weight * set.reps * 0.2), 0)
            )}
          >
            <Dumbbell className="mr-2 h-5 w-5" />
            Terminer l'exercice
          </Button>
        )}
      </div>
    </Card>
  );
};