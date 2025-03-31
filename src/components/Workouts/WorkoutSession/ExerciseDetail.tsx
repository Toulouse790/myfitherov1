
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, ChevronUp, Timer, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface ExerciseDetailProps {
  exerciseName: string;
  onComplete: (exerciseName: string) => void;
  onBack: () => void;
}

export const ExerciseDetail = ({ exerciseName, onComplete, onBack }: ExerciseDetailProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSets, setTotalSets] = useState(3);
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(12);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(90);
  const [completedSets, setCompletedSets] = useState<number[]>([]);

  const handleCompleteSet = () => {
    if (currentSet <= totalSets) {
      setCompletedSets([...completedSets, currentSet]);
      
      if (currentSet < totalSets) {
        // Passer à la série suivante avec un temps de repos
        setIsResting(true);
        
        const restInterval = setInterval(() => {
          setRestTime(prev => {
            if (prev <= 1) {
              clearInterval(restInterval);
              setIsResting(false);
              setCurrentSet(prev => prev + 1);
              setRestTime(90);
              return 90;
            }
            return prev - 1;
          });
        }, 1000);
        
        toast({
          title: t("workouts.setCompleted"),
          description: t("workouts.restBeforeNextSet"),
        });
      } else {
        // Dernière série terminée
        toast({
          title: t("workouts.exerciseCompleted"),
          description: t("workouts.allSetsCompleted"),
        });
        
        // Retourner à la liste après une courte pause
        setTimeout(() => {
          onComplete(exerciseName);
        }, 1500);
      }
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold ml-2">{exerciseName}</h2>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="font-medium">{t("workouts.progress")}:</p>
          <p>
            {t("workouts.set")} {currentSet} / {totalSets}
          </p>
        </div>
        
        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300" 
            style={{ width: `${(completedSets.length / totalSets) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {isResting ? (
        <div className="p-6 bg-secondary/10 rounded-lg space-y-4 text-center">
          <Timer className="w-8 h-8 mx-auto text-primary animate-pulse" />
          <h3 className="text-xl font-semibold">{t("workouts.restTime")}</h3>
          <p className="text-3xl font-mono">{restTime}</p>
          <Button variant="outline" onClick={() => {
            setIsResting(false);
            setCurrentSet(prev => prev + 1);
            setRestTime(90);
          }}>
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
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Input 
                type="number" 
                value={totalSets}
                onChange={(e) => setTotalSets(Number(e.target.value))}
                className="mx-2 text-center"
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
            className="w-full h-12"
            onClick={handleCompleteSet}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            {t("workouts.validateSet")}
          </Button>
        </div>
      )}
    </Card>
  );
};
