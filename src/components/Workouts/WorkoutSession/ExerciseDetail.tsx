
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, ChevronUp, Timer, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface ExerciseDetailProps {
  exerciseName: string;
  onComplete: (exerciseName: string, totalSets: number) => void;
  onBack: () => void;
  initialSets?: number;
}

export const ExerciseDetail = ({ 
  exerciseName, 
  onComplete, 
  onBack,
  initialSets = 3
}: ExerciseDetailProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSets, setTotalSets] = useState(initialSets);
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(12);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(90);
  const [restInterval, setRestInterval] = useState<NodeJS.Timeout | null>(null);
  const [completedSets, setCompletedSets] = useState<number[]>([]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (restInterval) clearInterval(restInterval);
    };
  }, [restInterval]);

  const handleCompleteSet = () => {
    if (currentSet <= totalSets) {
      setCompletedSets([...completedSets, currentSet]);
      
      if (currentSet < totalSets) {
        // Passer à la série suivante avec un temps de repos
        setIsResting(true);
        
        const interval = setInterval(() => {
          setRestTime(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsResting(false);
              setCurrentSet(prev => prev + 1);
              setRestTime(90);
              return 90;
            }
            return prev - 1;
          });
        }, 1000);
        
        setRestInterval(interval);
        
        // Calculer les calories brûlées (estimation)
        const caloriesBurned = Math.round(reps * weight * 0.15);
        
        toast({
          title: t("workouts.setCompleted"),
          description: `${caloriesBurned} ${t("workouts.caloriesBurned")}. ${t("workouts.restBeforeNextSet")}`,
        });
      } else {
        // Dernière série terminée
        toast({
          title: t("workouts.exerciseCompleted"),
          description: t("workouts.allSetsCompleted"),
        });
        
        // Retourner à la liste après une courte pause
        setTimeout(() => {
          onComplete(exerciseName, totalSets);
        }, 1500);
      }
    }
  };

  const skipRest = () => {
    if (restInterval) clearInterval(restInterval);
    setIsResting(false);
    setCurrentSet(prev => prev + 1);
    setRestTime(90);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold">{exerciseName}</h2>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="font-medium">{t("workouts.progress")}:</p>
          <p>
            {t("workouts.set")} {currentSet} / {totalSets}
          </p>
        </div>
        
        <Progress value={(completedSets.length / totalSets) * 100} />
      </div>
      
      {isResting ? (
        <div className="p-6 bg-secondary/10 rounded-lg space-y-4 text-center">
          <Timer className="w-8 h-8 mx-auto text-primary animate-pulse" />
          <h3 className="text-xl font-semibold">{t("workouts.restTime")}</h3>
          <p className="text-4xl font-mono">{restTime}s</p>
          <Button variant="outline" onClick={skipRest}>
            {t("workouts.skipRest")}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("workouts.weight")} (kg)</p>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setWeight(prev => Math.max(0, prev - 2.5))}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="mx-2 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setWeight(prev => prev + 2.5)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("workouts.reps")}</p>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setReps(prev => Math.max(1, prev - 1))}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Input 
                  type="number" 
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                  className="mx-2 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setReps(prev => prev + 1)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("workouts.numberOfSets")}</p>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTotalSets(prev => Math.max(1, prev - 1))}
                disabled={completedSets.length >= totalSets - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Input 
                type="number" 
                value={totalSets}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  if (newValue >= completedSets.length) {
                    setTotalSets(newValue);
                  }
                }}
                className="mx-2 text-center"
                min={completedSets.length + 1}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTotalSets(prev => prev + 1)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full h-12 gap-2"
            onClick={handleCompleteSet}
          >
            <CheckCircle className="h-5 w-5" />
            {currentSet === totalSets 
              ? t("workouts.completeExercise") 
              : t("workouts.validateSet")}
          </Button>
        </div>
      )}

      {/* Afficher résumé des sets précédents */}
      {completedSets.length > 0 && !isResting && (
        <div className="space-y-2 border-t pt-4">
          <p className="text-sm font-medium">{t("workouts.completedSets")}</p>
          <div className="space-y-1">
            {completedSets.map((setNum) => (
              <div key={setNum} className="flex items-center justify-between text-sm">
                <span>{t("workouts.set")} {setNum}</span>
                <span className="text-muted-foreground">{reps} x {weight}kg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
