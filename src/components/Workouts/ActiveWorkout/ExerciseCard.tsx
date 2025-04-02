
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, Timer } from "lucide-react";

interface ExerciseCardProps {
  currentExercise: string;
  currentSet: number;
  totalSets: number;
  restTime: number | null;
  onCompleteSet: () => void;
  onSkipRest: () => void;
}

export const ExerciseCard = ({
  currentExercise,
  currentSet,
  totalSets,
  restTime,
  onCompleteSet,
  onSkipRest
}: ExerciseCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{currentExercise}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t("workouts.currentSet")}</p>
            <p className="text-lg font-semibold">{currentSet} / {totalSets}</p>
          </div>
          
          {restTime !== null && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{t("workouts.restTimer")}</p>
              <p className="text-lg font-semibold">{restTime}s</p>
            </div>
          )}
        </div>
        
        {restTime !== null ? (
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000" 
                style={{ width: `${(1 - restTime / 90) * 100}%` }}
              ></div>
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={onSkipRest}
            >
              <Timer className="mr-2 h-4 w-4" />
              {t("workouts.skipRest")}
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full" 
            onClick={onCompleteSet}
          >
            <Check className="mr-2 h-4 w-4" />
            {currentSet > totalSets 
              ? t("workouts.completeExercise") 
              : t("workouts.validateSet") + " " + currentSet
            }
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
