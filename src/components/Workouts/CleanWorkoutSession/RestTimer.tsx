
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RestTimerProps {
  restTimer: number;
  onRestComplete: () => void;
  onSkipRest: () => void;
  onRestTimeChange: (adjustment: number) => void;
}

export const RestTimer = ({ 
  restTimer, 
  onRestComplete, 
  onSkipRest, 
  onRestTimeChange 
}: RestTimerProps) => {
  const { t } = useLanguage();
  const [timer, setTimer] = useState<number>(restTimer);
  
  useEffect(() => {
    if (timer <= 0) {
      onRestComplete();
      return;
    }
    
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timer, onRestComplete]);
  
  // Mise à jour du timer quand restTimer change
  useEffect(() => {
    setTimer(restTimer);
  }, [restTimer]);
  
  return (
    <div className="bg-muted p-4 rounded-lg">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          <Timer className="h-6 w-6 text-primary mr-2" />
          <span className="text-2xl font-bold text-primary">{timer}s</span>
        </div>
        <p className="text-sm text-center mt-2">{t("workouts.restingText")}</p>
        
        <div className="flex items-center gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onRestTimeChange(-15)} 
            disabled={timer <= 15}
          >
            -15s
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onRestTimeChange(15)}
          >
            +15s
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSkipRest} 
          className="mt-4"
        >
          {t("workouts.skipRest")}
        </Button>
      </div>
    </div>
  );
};
