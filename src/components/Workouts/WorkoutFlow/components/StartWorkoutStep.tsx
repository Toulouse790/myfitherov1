
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

interface StartWorkoutStepProps {
  exerciseCount: number;
  onStartWorkout: () => void;
}

export const StartWorkoutStep = ({ exerciseCount, onStartWorkout }: StartWorkoutStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex justify-center text-center space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold">Prêt à commencer ?</h2>
        <p className="text-muted-foreground">
          {exerciseCount} exercices sélectionnés
        </p>
        <Button 
          size="lg"
          onClick={onStartWorkout}
          className="mt-4 w-full sm:w-auto"
        >
          <Play className="w-5 h-5 mr-2" />
          Démarrer l'entraînement
        </Button>
      </div>
    </motion.div>
  );
};
