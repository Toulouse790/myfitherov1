
import { Button } from "@/components/ui/button";
import { Play, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseHeaderProps {
  name: string;
  isActive: boolean;
  onStart: () => void;
}

export const ExerciseHeader = ({ name, isActive, onStart }: ExerciseHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <h3 className="text-sm sm:text-base md:text-lg font-medium line-clamp-2 flex-1">{name}</h3>
      <Button
        variant={isActive ? "default" : "outline"}
        size="sm"
        className="flex-shrink-0 transition-all duration-300"
        onClick={onStart}
      >
        {isActive ? (
          <div className="flex items-center gap-1 sm:gap-2">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm whitespace-nowrap">{t("workouts.inProgress")}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <Play className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm whitespace-nowrap">{t("workouts.start")}</span>
          </div>
        )}
      </Button>
    </div>
  );
};
