import { Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RestTimerProps {
  restTimer: number | null;
}

export const RestTimer = ({ restTimer }: RestTimerProps) => {
  if (restTimer === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center justify-center gap-2 text-2xl font-bold text-primary"
    >
      <Timer className="h-6 w-6" />
      <span>{restTimer}s</span>
    </motion.div>
  );
};