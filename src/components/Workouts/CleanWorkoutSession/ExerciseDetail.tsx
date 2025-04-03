
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SetManager } from "../ExerciseSets/SetManager";

interface ExerciseDetailProps {
  exerciseName: string;
  onComplete: (totalSets: number) => void;
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
  const [completedSets, setCompletedSets] = useState(0);
  
  const handleSetComplete = () => {
    setCompletedSets(prev => prev + 1);
    if (completedSets + 1 >= initialSets) {
      onComplete(initialSets);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="p-0 h-auto"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t("common.back")}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => onComplete(completedSets || 1)}
            className="text-sm"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {t("workouts.completeExercise")}
          </Button>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">{exerciseName}</h2>
          <p className="text-muted-foreground">
            {t("workouts.completedSets")}: {completedSets}/{initialSets}
          </p>
        </div>
        
        <SetManager onSetComplete={handleSetComplete} />
      </CardContent>
    </Card>
  );
};
