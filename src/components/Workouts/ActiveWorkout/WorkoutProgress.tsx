
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkoutProgressProps {
  progress: number;
}

export const WorkoutProgress = ({ progress }: WorkoutProgressProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{t("workouts.start")}</span>
        <span>{Math.round(progress)}%</span>
        <span>{t("workouts.end")}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
