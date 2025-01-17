import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ExerciseTimelineProps {
  exercises: string[];
  currentExerciseIndex: number;
}

const getExerciseTips = (exerciseName: string): string[] => {
  const tips: Record<string, string[]> = {
    "Développé couché": [
      "Gardez vos omoplates serrées contre le banc",
      "Les pieds doivent rester bien ancrés au sol",
      "Descendez la barre jusqu'à ce qu'elle touche légèrement votre poitrine"
    ],
    "Squat": [
      "Gardez le dos droit et la poitrine haute",
      "Les genoux doivent suivre la direction des orteils",
      "Descendez jusqu'à ce que vos cuisses soient parallèles au sol"
    ],
    "Tractions": [
      "Commencez avec une prise légèrement plus large que les épaules",
      "Engagez vos muscles dorsaux avant de tirer",
      "Montez jusqu'à ce que votre menton dépasse la barre"
    ],
    "Curl biceps": [
      "Gardez vos coudes près du corps",
      "Évitez de balancer le corps",
      "Contractez bien les biceps en haut du mouvement"
    ]
  };

  // Si l'exercice n'est pas dans la liste, retourner des conseils généraux
  return tips[exerciseName] || [
    "Maintenez une respiration régulière",
    "Gardez une bonne posture",
    "Contrôlez le mouvement pendant toute l'exécution"
  ];
};

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
                ? 'bg-primary/20 text-primary'
                : 'bg-primary/10 text-primary/80'
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
                className="bg-primary/5 backdrop-blur-sm rounded-lg p-4 border border-primary/10 shadow-sm"
              >
                <div className="space-y-2">
                  <h4 className="font-medium text-primary">{`Conseils pour ${exercise}`}</h4>
                  <ul className="list-disc list-inside text-sm text-primary/70">
                    {getExerciseTips(exercise).map((tip, tipIndex) => (
                      <li key={tipIndex}>{tip}</li>
                    ))}
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