import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface RestTimerProps {
  restTimer: number | null;
  onRestTimeChange: (adjustment: number) => void;
}

export const RestTimer = ({ restTimer, onRestTimeChange }: RestTimerProps) => {
  if (restTimer === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center gap-4 p-4 bg-secondary/10 rounded-lg"
    >
      <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
        <Timer className="h-6 w-6" />
        <span>{restTimer}s</span>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRestTimeChange(-15)}
          disabled={restTimer <= 15}
        >
          -15s
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRestTimeChange(15)}
          disabled={restTimer >= 180}
        >
          +15s
        </Button>
      </div>
    </motion.div>
  );
};