
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface ExerciseListProps {
  exercises: string[];
  currentExerciseIndex: number;
  onExerciseSelect: (index: number) => void;
}

export const ExerciseList = ({ 
  exercises, 
  currentExerciseIndex, 
  onExerciseSelect 
}: ExerciseListProps) => {
  const { t } = useLanguage();

  if (exercises.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">{t("workouts.noExercisesFound")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">{t("workouts.exerciseLibrary")}</h2>
      
      {exercises.map((exercise, index) => (
        <motion.div 
          key={index}
          className={`p-4 rounded-lg border cursor-pointer hover:bg-primary/5 ${
            index === currentExerciseIndex ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => onExerciseSelect(index)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <h3 className="text-lg font-semibold">{exercise}</h3>
        </motion.div>
      ))}
    </div>
  );
};
