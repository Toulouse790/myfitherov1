import { Button } from "@/components/ui/button";
import { Timer, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface RestTimerProps {
  restTime: number;
  onRestTimeChange: (adjustment: number) => void;
}

export const RestTimer = ({ restTime, onRestTimeChange }: RestTimerProps) => {
  const handleTimeChange = (adjustment: number) => {
    const newTime = Math.max(15, restTime + adjustment);
    onRestTimeChange(newTime);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-4"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold">
          <Timer className="h-6 w-6 text-primary" />
          <span>{restTime}s</span>
        </div>
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleTimeChange(-15)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium w-16 text-center">
            {restTime}s
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleTimeChange(15)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};