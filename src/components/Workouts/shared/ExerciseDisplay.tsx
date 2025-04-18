
import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseDisplayProps {
  name: string;
  sets?: number;
  reps?: number;
  isCompleted?: boolean;
  onClick?: () => void;
}

export const ExerciseDisplay = ({ name, sets = 3, reps = 12, isCompleted, onClick }: ExerciseDisplayProps) => {
  const { t } = useLanguage();

  return (
    <Card 
      className={`p-4 hover:bg-accent/5 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Dumbbell className={`w-5 h-5 ${isCompleted ? 'text-green-500' : 'text-primary'}`} />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">
            {sets} {t("workouts.sets")} • {reps} {t("workouts.reps")}
          </p>
        </div>
      </div>
    </Card>
  );
};
