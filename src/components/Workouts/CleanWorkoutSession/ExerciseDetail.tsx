
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Timer, Check, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseDetailProps {
  exerciseName: string;
  onComplete: (sets: number) => void;
  onBack: () => void;
}

export const ExerciseDetail = ({ exerciseName, onComplete, onBack }: ExerciseDetailProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [sets, setSets] = useState<number>(3);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [weight, setWeight] = useState<number>(20);
  const [reps, setReps] = useState<number>(12);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [completedSets, setCompletedSets] = useState<number[]>([]);

  const handleSetComplete = () => {
    if (restTimer !== null) return;
    
    setCompletedSets(prev => [...prev, currentSet]);
    
    if (currentSet < sets) {
      setCurrentSet(prev => prev + 1);
      setRestTimer(90);
      
      const timerInterval = setInterval(() => {
        setRestTimer(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(timerInterval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast({
        title: t("workouts.completeSet"),
        description: `${t("workouts.rest")} 90 ${t("common.sec")} ${t("workouts.nextExercise")} ${currentSet + 1}`,
      });
    } else {
      toast({
        title: t("workouts.exerciseCompleted"),
        description: `${t("nutrition.completed")} ${sets} ${t("workouts.sets")} ${t("workouts.of")} ${exerciseName}`,
      });
      
      onComplete(sets);
    }
  };
  
  const skipRest = () => {
    setRestTimer(null);
  };
  
  const handleSetsChange = (increment: boolean) => {
    setSets(prev => {
      const newValue = increment ? prev + 1 : prev - 1;
      return Math.max(1, newValue);
    });
  };
  
  const handleWeightChange = (increment: boolean) => {
    setWeight(prev => {
      const change = increment ? 2.5 : -2.5;
      return Math.max(0, prev + change);
    });
  };
  
  const handleRepsChange = (increment: boolean) => {
    setReps(prev => {
      const newValue = increment ? prev + 1 : prev - 1;
      return Math.max(1, newValue);
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSetsChange(false)}
              disabled={sets <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{sets} {t("workouts.sets")}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSetsChange(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-xl mt-4">{exerciseName}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium mb-1">{t("workouts.currentSet")}</p>
            <p className="text-2xl font-bold">{currentSet} / {sets}</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium mb-1">{t("workouts.weight")}</p>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleWeightChange(false)}
                disabled={weight <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium">{weight} kg</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleWeightChange(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium mb-1">{t("workouts.reps")}</p>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleRepsChange(false)}
                disabled={reps <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium">{reps}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleRepsChange(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium mb-1">{t("workouts.completedSets")}</p>
            <p className="text-lg font-medium">{completedSets.length} / {sets}</p>
          </div>
        </div>
        
        {restTimer !== null ? (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <Timer className="h-6 w-6 text-primary mr-2" />
                <span className="text-2xl font-bold text-primary">{restTimer}s</span>
              </div>
              <p className="text-sm text-center mt-2">{t("workouts.restingText")}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={skipRest} 
                className="mt-4"
              >
                {t("workouts.skipRest")}
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            className="w-full py-6 text-lg" 
            onClick={handleSetComplete}
            disabled={completedSets.includes(currentSet)}
          >
            {currentSet <= sets ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                {t("workouts.validateSet")} {currentSet}
              </>
            ) : (
              <>
                <Check className="mr-2 h-5 w-5" />
                {t("workouts.completeExercise")}
              </>
            )}
          </Button>
        )}
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          {Array.from({ length: sets }, (_, i) => i + 1).map(setNumber => (
            <div 
              key={setNumber}
              className={`p-2 text-center rounded-md ${
                completedSets.includes(setNumber) 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {t("workouts.set")} {setNumber}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
