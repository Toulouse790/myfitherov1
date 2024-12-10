import { Timer, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface RestTimerProps {
  remainingTime: number;
  restTime: number;
  onRestTimeChange: (newTime: number) => void;
}

export const RestTimer = ({ remainingTime, restTime, onRestTimeChange }: RestTimerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed bottom-20 right-4 left-4 bg-card p-4 rounded-lg shadow-lg border"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold">
          <Timer className="h-6 w-6 text-primary" />
          <span>{remainingTime || restTime}s</span>
        </div>
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRestTimeChange(Math.max(15, restTime - 15))}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium min-w-[3ch] text-center">
            {restTime}s
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRestTimeChange(restTime + 15)}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};