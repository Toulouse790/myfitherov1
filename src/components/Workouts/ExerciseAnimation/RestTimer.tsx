import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { motion } from "framer-motion";

export interface RestTimerProps {
  restTime: number;
  onRestTimeChange: (adjustment: number) => void;
}

export const RestTimer = ({ restTime, onRestTimeChange }: RestTimerProps) => {
  const handleTimeAdjustment = (adjustment: number) => {
    const newTime = restTime + adjustment;
    // Ensure rest time stays between 15 and 180 seconds
    if (newTime >= 15 && newTime <= 180) {
      console.log("Adjusting rest time by:", adjustment, "New time:", newTime);
      onRestTimeChange(adjustment);
    } else {
      console.log("Invalid rest time adjustment. Current:", restTime, "Adjustment:", adjustment);
    }
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
        <span>{restTime}</span>
        <span className="text-lg">s</span>
      </div>
      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTimeAdjustment(-15)}
          disabled={restTime <= 15}
          className="w-20 transition-all duration-200 hover:bg-destructive/10"
        >
          -15s
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTimeAdjustment(15)}
          disabled={restTime >= 180}
          className="w-20 transition-all duration-200 hover:bg-primary/10"
        >
          +15s
        </Button>
      </div>
    </motion.div>
  );
};