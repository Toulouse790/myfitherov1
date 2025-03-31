
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RestTimerProps {
  restTimer: number | null;
  onRestTimeChange: (adjustment: number) => void;
}

export const RestTimer = ({ restTimer, onRestTimeChange }: RestTimerProps) => {
  const { t } = useLanguage();
  
  if (restTimer === null) return null;

  // Convert seconds to minutes and remaining seconds
  const minutes = Math.floor(restTimer / 60);
  const seconds = restTimer % 60;
  
  // Format the time string
  const timeDisplay = minutes > 0 
    ? `${minutes} ${t("common.min") || "min"} ${seconds.toString().padStart(2, '0')} ${t("common.sec") || "sec"}`
    : `${seconds} ${t("common.sec") || "sec"}`;

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onRestTimeChange(-15)}
        disabled={restTimer <= 15}
      >
        -
      </Button>
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Timer className="h-5 w-5 text-primary" />
        <span>{timeDisplay}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onRestTimeChange(15)}
        disabled={restTimer >= 180}
      >
        +
      </Button>
    </div>
  );
};
