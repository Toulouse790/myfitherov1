
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export interface RestTimerProps {
  restTime: number;
  onRestTimeChange: (adjustment: number) => void;
}

export const RestTimer = ({ restTime, onRestTimeChange }: RestTimerProps) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-center gap-2 text-xl md:text-2xl font-bold text-primary">
        <Timer className="h-5 w-5 md:h-6 md:w-6" />
        <span>{restTime}</span>
        <span className="text-base md:text-lg">secondes</span>
      </div>
      <div className="flex justify-center items-center gap-3 md:gap-4">
        <Button
          variant="outline"
          size={isMobile ? "default" : "sm"}
          onClick={() => onRestTimeChange(-15)}
          disabled={restTime <= 15}
          className={`${isMobile ? 'w-16' : 'w-20'} transition-all duration-200 hover:bg-destructive/10`}
          aria-label="Réduire de 15 secondes"
        >
          -15s
        </Button>
        <Button
          variant="outline"
          size={isMobile ? "default" : "sm"}
          onClick={() => onRestTimeChange(15)}
          disabled={restTime >= 180}
          className={`${isMobile ? 'w-16' : 'w-20'} transition-all duration-200 hover:bg-primary/10`}
          aria-label="Ajouter 15 secondes"
        >
          +15s
        </Button>
      </div>
    </motion.div>
  );
};
