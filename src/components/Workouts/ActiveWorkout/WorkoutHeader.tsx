
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkoutHeaderProps {
  navigate: NavigateFunction;
  sessionTime: number;
  formatTime: (seconds: number) => string;
}

export const WorkoutHeader = ({ navigate, sessionTime, formatTime }: WorkoutHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => navigate('/workouts')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("common.back")}
      </Button>
      <div className="text-lg font-mono">
        {formatTime(sessionTime)}
      </div>
    </div>
  );
};
