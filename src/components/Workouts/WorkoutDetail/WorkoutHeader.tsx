
import { useLanguage } from "@/contexts/LanguageContext";
import { Timer } from "lucide-react";

interface WorkoutHeaderProps {
  sessionDuration: number;
  formatTime?: (seconds: number) => string;
}

export const WorkoutHeader = ({ 
  sessionDuration, 
  formatTime 
}: WorkoutHeaderProps) => {
  const { t } = useLanguage();
  
  const formattedTime = formatTime 
    ? formatTime(sessionDuration)
    : new Date(sessionDuration * 1000).toISOString().substring(14, 19);
  
  return (
    <div className="flex justify-between items-center py-2 border-b">
      <h1 className="text-2xl font-bold">{t("workouts.workoutSession") || "Séance d'entraînement"}</h1>
      <div className="flex items-center gap-2 text-lg">
        <Timer className="h-5 w-5 text-primary" />
        <span className="font-mono">{formattedTime}</span>
      </div>
    </div>
  );
};
