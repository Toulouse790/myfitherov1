
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { RestTimer } from "./RestTimer";
import { SetControls } from "./SetControls";
import { SetProgress } from "./SetProgress";

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
  
  const handleRestComplete = () => {
    setRestTimer(null);
  };
  
  const handleSkipRest = () => {
    setRestTimer(null);
  };
  
  const handleRestTimeChange = (adjustment: number) => {
    if (restTimer !== null) {
      setRestTimer(Math.max(15, restTimer + adjustment));
    }
  };
  
  const handleSetsChange = (newValue: number) => {
    setSets(newValue);
  };
  
  const handleWeightChange = (newValue: number) => {
    setWeight(newValue);
  };
  
  const handleRepsChange = (newValue: number) => {
    setReps(newValue);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>
          <SetControls 
            value={sets}
            label={t("workouts.sets")}
            onChange={handleSetsChange}
            minValue={1}
            disabled={completedSets.length > 0}
          />
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
            <SetControls 
              value={weight}
              label="kg"
              onChange={handleWeightChange}
              step={2.5}
              minValue={0}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium mb-1">{t("workouts.reps")}</p>
            <SetControls 
              value={reps}
              label=""
              onChange={handleRepsChange}
              minValue={1}
            />
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium mb-1">{t("workouts.completedSets")}</p>
            <p className="text-lg font-medium">{completedSets.length} / {sets}</p>
          </div>
        </div>
        
        {restTimer !== null ? (
          <RestTimer 
            restTimer={restTimer} 
            onRestComplete={handleRestComplete}
            onSkipRest={handleSkipRest}
            onRestTimeChange={handleRestTimeChange}
          />
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
        
        <SetProgress sets={sets} completedSets={completedSets} />
      </CardContent>
    </Card>
  );
};
