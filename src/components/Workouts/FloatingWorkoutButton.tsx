import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingWorkoutButtonProps {
  selectedCount: number;
  onClick: () => void;
}

export const FloatingWorkoutButton = ({ selectedCount, onClick }: FloatingWorkoutButtonProps) => {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={onClick}
          className="shadow-lg rounded-full px-6 py-6 bg-primary hover:bg-primary/90"
        >
          <Dumbbell className="h-5 w-5 mr-2" />
          Lancer la séance ({selectedCount})
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};