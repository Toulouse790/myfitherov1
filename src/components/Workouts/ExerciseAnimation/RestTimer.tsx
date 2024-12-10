import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { motion } from "framer-motion";

interface RestTimerProps {
  restTime: number;
  onRestTimeChange: (adjustment: number) => void;
}

export const RestTimer = ({ restTime, onRestTimeChange }: RestTimerProps) => {
  const handleTimeAdjustment = (adjustment: number) => {
    // Calculate the new time by adding or subtracting 15 seconds
    const newTime = restTime + adjustment;
    // Pass the exact difference to maintain the precise adjustment
    onRestTimeChange(adjustment);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
        <Timer className="h-6 w-6" />
        <span>{restTime}s</span>
      </div>
      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTimeAdjustment(-15)}
          disabled={restTime <= 15}
        >
          -15s
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTimeAdjustment(15)}
          disabled={restTime >= 180}
        >
          +15s
        </Button>
      </div>
    </motion.div>
  );
};