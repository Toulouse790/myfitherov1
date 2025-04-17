
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, ChevronUp, Timer, CheckCircle, ArrowLeft, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useExerciseWeights } from "@/hooks/use-exercise-weights";
import { useExerciseReps } from "@/hooks/use-exercise-reps";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { debugLogger } from "@/utils/debug-logger";

interface ExerciseDetailProps {
  exerciseName: string;
  onComplete: (exerciseName: string, totalSets?: number) => void;
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
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSets, setTotalSets] = useState(initialSets);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(90);
  const [restInterval, setRestInterval] = useState<NodeJS.Timeout | null>(null);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  
  const { exerciseWeight, isLoading: isLoadingWeight, updateWeight } = useExerciseWeights(exerciseName);
  const { reps, updateReps } = useExerciseReps(exerciseName);
  const [weight, setWeight] = useState(20);
  
  useEffect(() => {
    if (exerciseWeight) {
      debugLogger.log("ExerciseDetail", "Poids récupéré:", exerciseWeight);
      setWeight(exerciseWeight.weight || 20);
    }
  }, [exerciseWeight]);

  const handleWeightChange = (newWeight: number) => {
    try {
      setWeight(newWeight);
      if (user) {
        debugLogger.log("ExerciseDetail", "Mise à jour du poids:", newWeight);
        updateWeight(newWeight);
      }
    } catch (error) {
      debugLogger.error("ExerciseDetail", "Erreur lors de la mise à jour du poids:", error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.weightUpdateFailed"),
        variant: "destructive",
      });
    }
  };

  const handleRepsChange = (newReps: number) => {
    try {
      debugLogger.log("ExerciseDetail", "Mise à jour des répétitions:", newReps);
      updateReps(newReps);
    } catch (error) {
      debugLogger.error("ExerciseDetail", "Erreur lors de la mise à jour des répétitions:", error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.repsUpdateFailed"),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (restInterval) clearInterval(restInterval);
    };
  }, [restInterval]);

  const handleCompleteSet = () => {
    if (currentSet <= totalSets) {
      setCompletedSets([...completedSets, currentSet]);
      
      if (currentSet < totalSets) {
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
        
        // Calcul des calories brûlées pour cette série
        const caloriesBurned = Math.round(reps * weight * 0.05);
        
        toast({
          title: t("workouts.setCompleted"),
          description: `${caloriesBurned} ${t("workouts.caloriesBurned")}. ${t("workouts.restBeforeNextSet")}`,
        });
      } else {
        toast({
          title: t("workouts.exerciseCompleted"),
          description: t("workouts.allSetsCompleted"),
        });
        
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

  const adjustRestTime = (seconds: number) => {
    setRestTime(prev => Math.max(15, Math.min(180, prev + seconds)));
  };

  return (
    <Card className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-lg md:text-xl font-semibold truncate">{exerciseName}</h2>
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
        <div className="p-4 md:p-6 bg-secondary/10 rounded-lg space-y-4 text-center">
          <Timer className="w-8 h-8 mx-auto text-primary animate-pulse" />
          <h3 className="text-lg md:text-xl font-semibold">{t("workouts.restTime")}</h3>
          <p className="text-3xl md:text-4xl font-mono">{restTime}s</p>
          
          <div className="flex justify-center items-center gap-4 my-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustRestTime(-15)}
              disabled={restTime <= 15}
              className="h-10 w-10"
              aria-label="Diminuer le temps de repos de 15 secondes"
            >
              <Minus className="h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustRestTime(15)}
              disabled={restTime >= 180}
              className="h-10 w-10"
              aria-label="Augmenter le temps de repos de 15 secondes"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={skipRest} 
            className="w-full"
            size={isMobile ? "lg" : "default"}
          >
            {t("workouts.skipRest")}
          </Button>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("workouts.weight")} {t("workouts.weightUnit")}</p>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleWeightChange(Math.max(0, weight - 2.5))}
                  className="h-9 md:h-10 w-9 md:w-10"
                  aria-label="Diminuer le poids"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Input 
                  type="number" 
                  value={weight}
                  onChange={(e) => handleWeightChange(Number(e.target.value))}
                  className="mx-2 text-center h-9 md:h-10"
                  min={0}
                  step={2.5}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleWeightChange(weight + 2.5)}
                  className="h-9 md:h-10 w-9 md:w-10"
                  aria-label="Augmenter le poids"
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
                  onClick={() => handleRepsChange(Math.max(1, reps - 1))}
                  className="h-9 md:h-10 w-9 md:w-10"
                  aria-label="Diminuer les répétitions"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Input 
                  type="number" 
                  value={reps}
                  onChange={(e) => handleRepsChange(Number(e.target.value))}
                  className="mx-2 text-center h-9 md:h-10"
                  min={1}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRepsChange(reps + 1)}
                  className="h-9 md:h-10 w-9 md:w-10"
                  aria-label="Augmenter les répétitions"
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
                className="h-9 md:h-10 w-9 md:w-10"
                aria-label="Diminuer le nombre de séries"
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
                className="mx-2 text-center h-9 md:h-10"
                min={completedSets.length + 1}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTotalSets(prev => prev + 1)}
                className="h-9 md:h-10 w-9 md:w-10"
                aria-label="Augmenter le nombre de séries"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full h-10 md:h-12 gap-2"
            onClick={handleCompleteSet}
            size={isMobile ? "lg" : "default"}
          >
            <CheckCircle className="h-5 w-5" />
            {currentSet === totalSets 
              ? t("workouts.completeExercise")
              : t("workouts.validateSet")}
          </Button>
        </div>
      )}

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
