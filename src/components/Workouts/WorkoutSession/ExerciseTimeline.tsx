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
      "Coudes à 45°, serrez les omoplates",
      "Touchez la poitrine, poussez explosif",
      "Expirez en poussant"
    ],
    "Squat": [
      "Regard horizontal, dos droit",
      "Genoux alignés avec orteils",
      "Poussez dans les talons"
    ],
    "Tractions": [
      "Rétractez les omoplates avant de tirer",
      "Tirez avec les coudes vers le bas",
      "Contrôlez la descente"
    ],
    "Curl biceps": [
      "Coudes fixes contre le corps",
      "Contractez fort en haut",
      "Pas de balancier"
    ],
    "Soulevé de terre": [
      "Barre collée au corps",
      "Poussez avec les jambes",
      "Gardez le dos verrouillé"
    ],
    "Développé épaules": [
      "Abdos gainés, dos droit",
      "Poussez à la verticale",
      "Contrôlez la descente"
    ],
    "Rowing barre": [
      "Tirez vers le nombril",
      "Serrez les omoplates",
      "Dos fixe, pas de balancier"
    ],
    "Extensions triceps": [
      "Coudes fixes près de la tête",
      "Extension complète en haut",
      "Contrôlez la descente"
    ]
  };

  return tips[exerciseName] || [
    "Respiration fluide",
    "Posture stable",
    "Mouvement contrôlé"
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
                  <h4 className="font-medium text-primary">Conseils techniques pour {exercise}</h4>
                  <ul className="list-disc list-inside text-sm text-primary/70 space-y-1">
                    {getExerciseTips(exercise).map((tip, tipIndex) => (
                      <li key={tipIndex} className="leading-relaxed">{tip}</li>
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
