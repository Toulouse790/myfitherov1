
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CurrentExerciseCardProps {
  currentExercise: string;
  exerciseProgress: Record<string, {
    totalSets: number;
  }>;
  onStartExercise: () => void;
}

export const CurrentExerciseCard = ({
  currentExercise,
  exerciseProgress,
  onStartExercise
}: CurrentExerciseCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t("workouts.currentExercise")}</h2>
        <div className="bg-secondary/10 p-4 rounded-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{currentExercise}</p>
            <p className="text-sm text-muted-foreground">
              {exerciseProgress[currentExercise]?.totalSets || 3} {t("workouts.sets")}
            </p>
          </div>
          <Button 
            onClick={onStartExercise}
            className="ml-auto"
          >
            {t("workouts.start")}
          </Button>
        </div>
      </div>
    </Card>
  );
};
