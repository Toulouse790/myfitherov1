import { ExerciseDetail } from "./ExerciseDetail";
import { motion } from "framer-motion";

interface CurrentExerciseProps {
  exercises: string[];
  currentExerciseIndex: number | null;
}

export const CurrentExercise = ({ 
  exercises,
  currentExerciseIndex 
}: CurrentExerciseProps) => {
  if (currentExerciseIndex === null || !exercises[currentExerciseIndex]) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-full text-muted-foreground"
      >
        <p className="text-lg">Sélectionnez un exercice pour commencer</p>
      </motion.div>
    );
  }

  return <ExerciseDetail exercise={exercises[currentExerciseIndex]} />;
};