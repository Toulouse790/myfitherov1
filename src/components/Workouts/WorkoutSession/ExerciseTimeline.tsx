import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ExerciseTimelineProps {
  exercises: string[];
  currentExerciseIndex: number;
}

export const ExerciseTimeline = ({ exercises, currentExerciseIndex }: ExerciseTimelineProps) => {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);

  const handleExerciseClick = (index: number) => {
    setSelectedExercise(selectedExercise === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {exercises.map((exercise, index) => (
        <div key={index} className="space-y-2">
          <div
            onClick={() => handleExerciseClick(index)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg cursor-pointer transition-all
              ${index === currentExerciseIndex
                ? 'bg-primary text-primary-foreground'
                : index < currentExerciseIndex
                ? 'bg-muted text-muted-foreground'
                : 'bg-secondary/10 text-secondary-foreground'
              }
              hover:opacity-90
            `}
          >
            <div className="flex items-center justify-between">
              <span>{exercise}</span>
              {selectedExercise === index ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>

          <AnimatePresence>
            {selectedExercise === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border shadow-sm"
              >
                <div className="space-y-2">
                  <h4 className="font-medium">Conseils pour {exercise}</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Gardez une bonne posture</li>
                    <li>Respirez régulièrement</li>
                    <li>Contrôlez le mouvement</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};